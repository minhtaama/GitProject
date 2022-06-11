let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let ballImg = new Image();
ballImg.src = "Ball.png";

class Bal {
    constructor (radius,power) {
        this.radius = radius;
        this.x;
        this.y;
        this.xFlag = 0; //0: move left, 1: move right
        this.yFlag = 0; //0: move up, 1: move down
        this.spHorizon = Math.sqrt(8);
        this.spVertical = Math.sqrt(8);
        this.touchBorderBottom = 0;
        this.xT;        //coordinates of nearest touch point on target
        this.yT;        //
        this.isHasPower = power;
    }
    getCoordinates(x,y) {
        this.x = x;
        this.y = y;
    }
    getSpeed() {
        this.speed = Math.sqrt(this.spVertical**2 + this.spHorizon**2);
    }
    isTouch(target) {
        let range;      //range from ball to touch point
        if(this.x <= target.x) {
            this.xT = target.x;
        } else if (this.x >= target.x + target.width) {
            this.xT = target.x + target.width;
        } else if (this.x > target.x && this.x < target.x + target.width) {
            this.xT = this.x;
        }
        if(this.y <= target.y) {
            this.yT = target.y;
        } else if(this.y >= target.y + target.height) {
            this.yT = target.y + target.height;
        } else if (this.y > target.y  && this.y < target.y + target.height) {
            this.yT = this.y;
        }
        // /drawRange///
        //     ctx.beginPath();
        //     ctx.arc(this.xT,this.yT,2,0,2*Math.PI);
        //     ctx.fillStyle = "blue";
        //     ctx.fill();
        //     ctx.beginPath();
        //     ctx.moveTo(this.x,this.y);
        //     ctx.lineTo(this.xT,this.yT);
        //     ctx.strokeStyle = "gray";
        //     ctx.stroke();
        // ////////////
        range = Math.sqrt((this.x - this.xT)**2 + (this.y - this.yT)**2) - this.radius;
        if (range <= 0 && target.canTouch) {
            //offset ball(x,y) to not go inside target if target is moving
            if (this.x <= target.x) {
                this.x -= target.spHorizon; 
            } 
            else if (this.x >= target.x + target.width) {
                this.x += target.spHorizon;
            }
            if (this.y <= target.y) {
                this.y -= target.spVertical; 
            }
            else if (this.y >= target.y + target.width) {
                this.y += target.spVertical;
            }
            return true;
        } else return false;
    }
    modDirection(target) {
        this.getSpeed(); //this.speed always a CONST
        if(target.goLeft) {
            switch(this.xFlag) {
                case 0:
                    this.spHorizon += (this.speed - this.spHorizon)/8;
                    break;
                case 1:
                    this.xFlag = 0;
                    this.spHorizon -= this.spHorizon/3;
                    break;
            }
            this.spVertical = Math.sqrt(this.speed**2 - this.spHorizon**2);
            console.log("ball speed:",this.speed," /ball => vector:", this.spHorizon, "/ ball ^ vector:", this.spVertical);
        } else if(target.goRight) {
            switch(this.xFlag) {
                case 0:
                    this.xFlag = 1;
                    this.spHorizon -= this.spHorizon/3;
                    break;
                case 1:
                    this.spHorizon += (this.speed - this.spHorizon)/8;
                    break;
            }
            this.spVertical = Math.sqrt(this.speed**2 - this.spHorizon**2);
            console.log("ball speed:",this.speed," /ball => vector:", this.spHorizon, "/ ball ^ vector:", this.spVertical);
        } else {
            if(Math.floor(Math.random()*2)==0) {
                this.spHorizon -= Math.sqrt(this.spHorizon**2/100);
                this.spVertical = Math.sqrt(this.speed**2 - this.spHorizon**2);
            } else {
                this.spVertical -= Math.sqrt(this.spVertical**2/100);
                this.spHorizon = Math.sqrt(this.speed**2 - this.spVertical**2);
            }
        }
        //switch move up/down and move left/right
        if(this.xT == target.x) {
            this.xFlag = 0;
        } else if(this.xT == target.x + target.width) {
            this.xFlag = 1;
        } else if(this.yT == target.y) {
            this.yFlag = 0;
        } else if(this.yT == target.y + target.height) {
            this.yFlag = 1;
        }
    }
    spawnPower(powers,targets,powName) {
        powers.array.push(new Pow(targets.x,targets.y,targets.width,targets.height,powName));
    }

    whenTouch(pad) {
        if(this.isTouch(pad)) {
            this.modDirection(pad);
            pad.y = pad.yFixed;
            pad.goDown = true;
            console.log("touched");
        }
        if(pad.y - pad.yFixed >= 14) {
            pad.goDown = false;
            pad.goUp = true;
        }
        if(pad.y <= pad.yFixed) {
            pad.goUp = false;
        }
    }
    whenTouchTargets(powers, targets){
        for(let i = 0; i < targets.length; i++) {
            if(this.isTouch(targets[i])) {
                if(!targets[i].isWall) {
                    if(Math.floor(Math.random() * 10) >= 7) {       //percentage of spawning powers
                        let j = Math.floor(Math.random()*5);
                        switch(j) {
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                                this.spawnPower(powers, targets[i],"add-ball");
                                break;
                            case 4:
                                this.spawnPower(powers, targets[i],"rocket");
                                break;
                        }
                    }
                }
                switch(this.isHasPower) {
                    case "no-power":
                        if(targets[i].canTouch) {
                            this.modDirection(targets[i]);
                            if(!targets[i].isWall) {
                                targets[i].goDown = true;
                                targets[i].canTouch = false;
                            }
                        }
                        if (targets[i].y >= canvas.height && !targets[i].canTouch) {
                            targets[i] = 0;
                        }
                        break;
                    case "rocket":
                        targets[i] = 0;
                        break;
                }
            }
        }
    }
    whenTouchBorder() {
        if(this.x - this.radius <= 0) {                 //if touch left
            this.xFlag = 1;
        }
        if(this.x + this.radius >= canvas.width-1) {    //if touch right
            this.xFlag = 0;
        }
        if(this.y - this.radius <= 0) {                 //if touch top
            this.yFlag = 1;
        }
        // if(this.y + this.radius >= canvas.height) {     //if touch bottom
        //     this.touchBorderBottom = 1;
        //     this.yFlag = 0;
        // }
    }
    move(){
        if(this.xFlag == 1) {
            this.x += this.spHorizon;                   //move right
        }
        if(this.xFlag == 0) {
            this.x -= this.spHorizon;                   //move left
        }
        if(this.yFlag == 1) {
            this.y += this.spVertical;                  //move bottom
        }
        if(this.yFlag == 0) {
            this.y -= this.spVertical;                  //move top
        }
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        switch(this.isHasPower) {
            case "no-power":
                ctx.fillStyle = "blue";
                break;
            case "rocket":
                ctx.fillStyle = "red";
                break;
        }
        ctx.fill();
    }
}

class Balls {
    constructor() {    
        this.array = [];
        this.isPlaying = true;
    }
    isEnd() {
        let count = 0;
        for(let i = 0; i < this.array.length; i++) {
            if(typeof this.array[i] == "object") {
                count += 1;
            }
        }
        if(count == 0) {
            this.isPlaying = false;
        }
    }
    display(pad,targets,powers) {
        this.isEnd();
        for(let i = 0; i<this.array.length; i++) {
            if(this.array[i]) {
                switch(this.array[i].isHasPower) {
                    case "no-power":
                        this.array[i].whenTouch(pad);
                        this.array[i].whenTouchTargets(powers,targets.array);
                        this.array[i].whenTouchBorder();
                        break;
                    case "rocket":
                        this.array[i].whenTouchTargets(powers,targets.array);
                        break;
                }
                this.array[i].move();
                if(this.array[i].y >= canvas.height || this.array[i].y < -10) {
                    this.array[i] = 0;
                    console.log(this.array);
                }
            }
        }
    }
}

class Pad {
    constructor (width) {
        this.width = width;
        this.height = 10;
        this.yFixed = canvas.height - 40;
        this.spVertical = 2;
        this.spHorizon = 6;
        this.canTouch = true;
        this.goLeft = false;
        this.goRight = false;
        this.goUp = false;
        this.goDown = false;
    }
    getCoordinates(x) {
        this.x = x;
        this.y = this.yFixed;
    }
    move(){
        if(this.goLeft && this.x > 0) {
            this.x -= this.spHorizon;
        }
        if(this.goRight && (this.x + this.width) < canvas.width) {
            this.x += this.spHorizon;
        }
        if(this.goUp) {
            this.y -= this.spVertical;
        }
        if(this.goDown) {
            this.y += this.spVertical;
        }
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}

class Tar{
    constructor(x,y,width,height,isWall){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.spHorizon = 0;
        this.spVertical = 1;
        this.goDown = false;
        this.canTouch = true;
        this.isWall = isWall;
    }
    display() {
        ctx.beginPath();
        if(!this.isWall){
            if(this.canTouch) {
                ctx.fillStyle = "green";
            } else ctx.fillStyle = "LightGreen";
            ctx.strokeStyle = "white";
        } else {
            ctx.fillStyle = "gray";
            ctx.strokeStyle = "white";
        }
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    move() {
        if(this.goDown) {
            this.spVertical += 0.7;
            this.y += this.spVertical;
        }
    }
}

// class Targets {
//     constructor() {
//         this.array = [];
//         this.yEachRow = 0;
//         this.tarHeight = 15;
//     }
//     setMaxInRow(number, yPos, checkPoint1, checkPoint2) {
//         let x = 0;
//         const WIDTH = canvas.width/number;
//         for(let i = 0; i < number; i++) {
//             let random = Math.floor(Math.random() * 10);
//             if (random >= checkPoint1 && random < checkPoint2) {
//                this.array.push(new Tar(x,yPos,WIDTH,this.tarHeight,true)); //wall
//             } else if(random >= checkPoint2) {
//                 this.array.push(new Tar(x,yPos,WIDTH,this.tarHeight,false)); //target
//             } else this.array.push(0);
//             x += WIDTH;
//         }
//     }
//     setRows(maxInRow, rows){
//         for(let i=0; i< rows; i++){
//             if(i == rows-1){
//                 this.setMaxInRow(maxInRow,this.yEachRow,7,10);
//             } else if(i <= rows-2 && i >= rows-4){
//                 this.setMaxInRow(maxInRow,this.yEachRow,8,8);
//             } 
//             else this.setMaxInRow(maxInRow,this.yEachRow,4,4);
//             this.yEachRow+=this.tarHeight;
//         };
//     }
//     display(){
//         for(let i=0; i<this.array.length; i++){
//             if(this.array[i]) {
//                 this.array[i].display();
//                 this.array[i].move();
//             }
//         }
//     }
// }

class Targets {
    constructor() {
        this.array = [];
        this.yEachRow = 0;
        this.tarHeight = 15;
        this.level;
    }
    setMaxInRow(yPos, ...args) {
        let x = 0;
        const WIDTH = canvas.width/args.length;
        for(let j = 0; j < args.length; j++){
            if (args[j] == 1) {
            this.array.push(new Tar(x,yPos,WIDTH,this.tarHeight,true)); //wall
            } else if(args[j]==2) {
                this.array.push(new Tar(x,yPos,WIDTH,this.tarHeight,false)); //target
            } else this.array.push(0);
            x += WIDTH;
        }
        this.yEachRow+=this.tarHeight;
    }
    display(){
        for(let i=0; i<this.array.length; i++){
            if(this.array[i]) {
                this.array[i].display();
                this.array[i].move();
            }
        }
    }
}

class Pow {
    constructor(x, y, width, height, power) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.spVertical = 2;
        this.xT;        //coordinates of nearest touch point on target
        this.yT;        //
        this.power = power;
    }
    isTouch(target) {
        let distantX = Math.abs(this.x+this.width/2 - (target.x+target.width/2));
        let distantY = Math.abs(this.y+this.height/2 - (target.y+target.height/2));
        if((this.width + target.width)/2 >= distantX && (this.height + target.height)/2 >= distantY) {
            return true;
        } else return false;
    }
    powerSelect(balls){
        let bal;
        let x,y;
        switch(this.power) {
            case "add-ball":
                bal = new Bal(6, "no-power");
                for(let i=0; i<=balls.array.length-1 ; i++) {
                    if(typeof balls.array[i] == "object" && balls.array[i].isHasPower == "no-power"){
                        bal.spHorizon = balls.array[i].spVertical;
                        bal.spVertical = balls.array[i].spHorizon;
                        bal.yFlag = balls.array[i].yFlag;
                        bal.xFlag = balls.array[i].xFlag;
                        // bal.spHorizon = balls.array[i].spHorizon;
                        // bal.spVertical = balls.array[i].spVertical;
                        x = balls.array[i].x; 
                        y = balls.array[i].y;
                        if(balls.array[i].yFlag == 0) {
                            break;
                        }
                    }
                }
                break;
            case "rocket":
                bal = new Bal(6, "rocket");
                x = this.x;
                y = this.y;
                bal.spVertical = 3;
                bal.spHorizon = 0;
                break;
        }
        if(x && y) {
            balls.array.push(bal);
            bal.getCoordinates(x,y);
        }
        console.log(balls.array)
    }
    move() {
        ctx.beginPath();
        switch(this.power) {
            case "add-ball":
                ctx.fillStyle = "orange";
                break;
            case "rocket":
                ctx.fillStyle = "purple";
                break;
        }
        ctx.strokeStyle = "white";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillRect(this.x,this.y,this.width,this.height);
        this.y += this.spVertical;
    }
}

class Powers {
    constructor(){
        this.array = [];
    }
    display(pad, balls) {
        for(let i = 0; i< this.array.length; i++){
            if(this.array[i]) {
                this.array[i].move();
                if(this.array[i].isTouch(pad)){
                    this.array[i].powerSelect(balls);
                    this.array[i] = 0;
                } else if(this.array[i].y >= canvas.height) {
                    this.array[i] = 0;
                }
            }            
        }
    }
}


class BouncingBall {
    constructor (padWidth) {
        this.balls = new Balls();
        this.pad = new Pad(padWidth);
        this.targets = new Targets();
        this.powers = new Powers();
        this.isWin = false;
    }
    display() {
        if(this.balls.isPlaying){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            this.targets.display();
            this.pad.move();
            this.balls.display(this.pad,this.targets,this.powers);
            this.powers.display(this.pad,this.balls);
        }
    }
}





let game = new BouncingBall(80);
game.balls.array.push(new Bal(6, "no-power"));
game.pad.getCoordinates(canvas.width/2-game.pad.width/2);
game.balls.array[0].getCoordinates(canvas.width/2,game.pad.y-game.balls.array[0].radius);
// game.targets.setRows(30,15);
game.targets.setMaxInRow(game.targets.yEachRow,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
game.targets.setMaxInRow(game.targets.yEachRow,1,2,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1);


function animate(){
    setTimeout(() => {
        requestAnimationFrame(animate);
        game.display();
    }, 1000/90);
}
animate();

document.addEventListener("keydown",(e)=>{
    if(e.key == "ArrowLeft") {
        game.pad.goLeft = true;
    }
    if(e.key == "ArrowRight") {
        game.pad.goRight = true;
    }
})
document.addEventListener("keyup", (e) => {
    if (e.key == "ArrowLeft") {
        game.pad.goLeft = false;
    }
    if (e.key == "ArrowRight") {
        game.pad.goRight = false;
    }
})

document.getElementById("left").addEventListener("touchstart",(e)=>{
    game.pad.goLeft = true;
})
document.getElementById("left").addEventListener("touchend",(e)=>{
    game.pad.goLeft = false;
})
document.getElementById("right").addEventListener("touchstart",(e)=>{
    game.pad.goRight = true;
})
document.getElementById("right").addEventListener("touchend",(e)=>{
    game.pad.goRight = false;
})
