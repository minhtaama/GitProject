class Mouse {
	constructor(name,weight,speed){
		this.name = name;
		this.weight = weight;
		this.speed = speed;
		this.isDead = false;
	}
	getDisplay() {
		let mouse = new DisplayObject();
		return `<div>
					${mouse.setObject("black-mouse.png",150) +
					mouse.setInfo(this.name,this.weight,this.speed) +
					this.getSounding()}
				</div>`;
	}
	getSounding() {
		let array = ["Chít chít","Chít chít chíttttttt","Gâu Gâu",
					"Chít cha chít chít","Thèm thịt chó quá!", "Tao lại sợ mèo quá"]
		let i = Math.floor(Math.random()*array.length);
		return `<p>"${array[i]}"</p>`;
	}
	soundDead() {
		let array = ["Ựa","Tạm biệt thế giới","Ặc ặc",
					"Á hự","...", ":("]
		let i = Math.floor(Math.random()*array.length);
		return array[i];
	}

}

class Cat {
	constructor(name, weight, maxSpeed) {
		this.name = name;
		this.weight = weight;
		this.maxSpeed = maxSpeed;
		this.mouse;
	}
	getSounding() {
		let array = ["Meo meo","Meoooooooo","Meowwwwww",
					"Grừ grừ","Ẳng ẳng","Chuột đâu rồi?"]
		let i = Math.floor(Math.random()*array.length);
		return `<p>"${array[i]}"</p>`;
	}
	getDisplay() {
		let cat = new DisplayObject();
		return `${cat.setObject("black-cat.png",200)}
				<div>
				${cat.setInfo(this.name, this.weight, this.maxSpeed) + this.getSounding()}
				</div>`;
	}
	choose(mouse){
		this.mouse = mouse;
		return this.mouse;
	}
	catchMouse() {
		let isCatch;
		if (this.maxSpeed >= this.mouse.speed) {
			isCatch = true;
		} else isCatch = false;
		if(isCatch && !this.mouse.isDead) {
			this.mouse.isDead = true;
			this.mouse.speed = 0;
			this.weight += this.mouse.weight;
			this.eat();
		} else {
			this.cantEat();
		}
	}
	eat() {
		let array = ["Nom nom nom","Yummy","Khá là béo",
					"Cũng tàm tạm","^^",":D"]
		let i = Math.floor(Math.random()*array.length);
		return array[i];
	}
	cantEat() {
		if(this.mouse.isDead) {
			let array = ["Chuột chết rồi ăn sao?","Chuột chết gòi",":-j",
						"???","No thanks, that rat is dead!","wtf?"]
			let i = Math.floor(Math.random()*array.length);
			return array[i];
		}
		else {
			let array = ["Con chuột này chạy nhanh quá","Không đuổi kịp rồi","Chịu chịu rồi chạy nhanh quá",
						"Chạy nhanh quá không đuổi được đâu","Ẳng ẳng","Chuột đâu rồi?"]
			let i = Math.floor(Math.random()*array.length);
			return array[i];
		}
	}
}

class DisplayObject {
	constructor() {
		this.imgSource;
		this.invert = Math.floor(Math.random()*50);
		this.sepia = Math.floor(Math.random()*50);
		this.saturate = Math.floor(Math.random()*5000+2000);
		this.hueRotate = Math.floor(Math.random()*360);
	}
	setObject(img,width,height) {
		return `<img src="${img}" style="${this.getRandomColor()};
				width: ${width}px; height: ${height}px;">`;
	}
	setInfo(name,weight,speed) {
		return `<p>Tên: ${name}<br>Cân nặng: ${weight} kg<br>Tốc độ chạy: ${speed} km/h`;
	}
	getRandomColor() {
		return `filter: invert(${this.invert}%) sepia(${this.sepia}%)
				saturate(${this.saturate}%) hue-rotate(${this.hueRotate}deg)`;
	}
}


let catDisplay = document.getElementById("cat-info");
let mouseDisplay = document.getElementById("mouse-info");
let randomNames = ["Johnny Depp","Amber Heard","Mickey",
					"Chuột","Mòe","Lợn","Chó","Wick",
					"Mun", "Mít", "Tít", "Nhãn"]


function newCat() {
	let cat = new Cat(randomNames[Math.floor(Math.random()*randomNames.length)],
						Math.floor(Math.random()*50),
						Math.floor(Math.random()*50));
	catDisplay.innerHTML = cat.getDisplay();
}

function newMouse() {
	mouseDisplay.innerHTML = "";
	for(let i=0; i<4; i++) {
		let mouse = new Mouse(randomNames[Math.floor(Math.random()*randomNames.length)],
								Math.floor(Math.random()*20),
								Math.floor(Math.random()*70));
		mouseDisplay.innerHTML += mouse.getDisplay();
	}
}