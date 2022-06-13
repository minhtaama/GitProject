let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let noPowImg = new Image();
let rocketImg = new Image();
let padImg = new Image();
let wallImg = new Image();
let tarImg = new Image();
let tarDeadImg = new Image();
let trsureRocketImg = new Image();
let trsureAddBallImg = new Image();

noPowImg.src = "source/no-power-ball.png";
rocketImg.src = "source/rocket.png"
padImg.src = "source/pad.png"
wallImg.src = "source/wall.png"
tarImg.src = "source/target.png"
tarDeadImg.src = "source/target-dead.png"
trsureRocketImg.src = "source/trsure-rocket.png"
trsureAddBallImg.src = "source/trsure-add-ball.png"

let leftBtn = new Image();
let leftBtnP = new Image();
let rightBtn = new Image();
let rightBtnP = new Image();

leftBtn.src = "source/left.png"
leftBtnP.src = "source/left-press.png"
rightBtn.src = "source/right.png"
rightBtnP.src = "source/right-press.png"

class Bal {
    constructor (radius,power) {
        this.radius = radius;
        this.x;
        this.y;
        this.xFlag = 0; //0: move left, 1: move right
        this.yFlag = 0; //0: move up, 1: move down
        this.spHorizon = Math.sqrt(12.5);
        this.spVertical = Math.sqrt(12.5);
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
        //     this.yFlag = 0;
        // }
    }
    move(){
        if(this.xFlag == 1) {
            if (this.isHasPower == "rocket") {
                this.spHorizon *= 1.015;
            }
            this.x += this.spHorizon;                   //move right
        }
        if(this.xFlag == 0) {
            if (this.isHasPower == "rocket") {
                this.spHorizon *= 1.015;
            }
            this.x -= this.spHorizon;                   //move left
        }
        if(this.yFlag == 1) {
            this.y += this.spVertical;                  //move bottom
        }
        if(this.yFlag == 0) {
            if(this.isHasPower == "rocket") {
                this.spVertical *=1.015;
            }
            this.y -= this.spVertical;                  //move top
        }
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        switch(this.isHasPower) {
            case "no-power":
                ctx.drawImage(noPowImg,this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2);
                break;
            case "rocket":
                ctx.drawImage(rocketImg,this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*4);
                break;
        }
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
        this.height = 20;
        this.yFixed = canvas.height - 70;
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
            ctx.save();
            ctx.translate(this.x + this.width/2, this.y + this.height/2);
            ctx.rotate(-8*Math.PI/180);
            if (this.goUp) {
                this.y -= this.spVertical;
            } if (this.goDown) {
                this.y += this.spVertical;
            }
            ctx.drawImage(padImg,-this.width/2, -this.height/2, this.width,this.height);
            ctx.restore();
        } else if(this.goRight && (this.x + this.width) < canvas.width) {
            this.x += this.spHorizon;
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(8 * Math.PI / 180);
            if(this.goUp) {
                this.y -= this.spVertical;
            } if(this.goDown) {
                this.y += this.spVertical;
            }
            ctx.drawImage(padImg, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        } else {
            if(this.goUp) {
            this.y -= this.spVertical;
            } if(this.goDown) {
                this.y += this.spVertical;
            }
            ctx.drawImage(padImg,this.x, this.y, this.width,this.height);
        }
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
        //ctx.beginPath();
        if(!this.isWall){
            if(this.canTouch) {
                ctx.drawImage(tarImg,this.x,this.y,this.width,this.height);
            } else {
                ctx.save();
                ctx.globalAlpha = 0.6;
                ctx.drawImage(tarDeadImg,this.x,this.y,this.width,this.height);
                ctx.restore();
            }
        } else {
            ctx.drawImage(wallImg,this.x,this.y,this.width,this.height);
        }
    }
    move() {
        if(this.goDown) {
            this.spVertical += 0.1;
            this.y += this.spVertical;
        }
    }
}

class Targets {
    constructor() {
        this.array = [];
        this.yEachRow = 0;
        this.tarHeight = 32;
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
            } else if(args[j]==0) {
                this.array.push(0);
            }
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
    powerSelect(balls, pad){
        let bal;
        let x,y;
        switch(this.power) {
            case "add-ball":
                bal = new Bal(11, "no-power");
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
                bal = new Bal(12, "rocket");
                x = this.x;
                y = this.y;
                if(pad.goLeft) {
                    bal.spHorizon = Math.sqrt(1);
                    bal.spVertical = Math.sqrt(8);
                    bal.xFlag = 0;
                } else if(pad.goRight) {
                    bal.spHorizon = Math.sqrt(1);
                    bal.spVertical = Math.sqrt(8);
                    bal.xFlag = 1;
                } else {
                    bal.spHorizon = 0;
                    bal.spVertical = 3;
                }
                break;
        }
        if(x && y) {
            balls.array.push(bal);
            bal.getCoordinates(x,y);
        }
        console.log(balls.array)
    }
    move() {
        // ctx.save();
        ctx.beginPath();
        // ctx.translate(this.x+this.width/2, this.y+this.height/2)
        // ctx.rotate(10*Math.PI/180);
        switch(this.power) {
            case "add-ball":
                ctx.drawImage(trsureAddBallImg,this.x,this.y,this.width,this.height);;
                break;
            case "rocket":
                ctx.drawImage(trsureRocketImg,this.x,this.y,this.width,this.height);;
                break;
        }
        // ctx.restore();
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
                    this.array[i].powerSelect(balls,pad);
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
            ctx.fillStyle = "#F9F6EE"
            ctx.fillRect(0,0,canvas.width,canvas.height);
            this.targets.display();
            this.pad.move();
            this.balls.display(this.pad,this.targets,this.powers);
            this.powers.display(this.pad,this.balls);
        }
    }
}



///////// RUN THE GAME /////////

window.onload = function() {

    let game = new BouncingBall(160);
    game.balls.array.push(new Bal(11, "no-power"));
    game.pad.getCoordinates(canvas.width/2-game.pad.width/2);
    game.balls.array[0].getCoordinates(canvas.width/2,game.pad.y-game.balls.array[0].radius);
    // game.targets.setRows(30,15);
    game.targets.setMaxInRow(game.targets.yEachRow,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1);
    game.targets.setMaxInRow(game.targets.yEachRow,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
    game.targets.setMaxInRow(game.targets.yEachRow,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
    game.targets.setMaxInRow(game.targets.yEachRow,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1);
    game.targets.setMaxInRow(game.targets.yEachRow,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1);
    game.targets.setMaxInRow(game.targets.yEachRow,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
    game.targets.setMaxInRow(game.targets.yEachRow,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
    game.targets.setMaxInRow(game.targets.yEachRow,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
    game.targets.setMaxInRow(game.targets.yEachRow,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
    game.targets.setMaxInRow(game.targets.yEachRow,1,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
    game.targets.setMaxInRow(game.targets.yEachRow,1,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
    game.targets.setMaxInRow(game.targets.yEachRow,1,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
    game.targets.setMaxInRow(game.targets.yEachRow,1,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
    game.targets.setMaxInRow(game.targets.yEachRow,1,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1);
    game.targets.setMaxInRow(game.targets.yEachRow,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1);
    
    
    function animate(){
        //setTimeout(() => {
            game.display();
            requestAnimationFrame(animate);
        //}, 1000/144);
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
    
    let ctxLeft = document.getElementById("left").getContext("2d");
    let ctxRight = document.getElementById("right").getContext("2d");
    ctxLeft.drawImage(leftBtnP,0,0,96,96);
    ctxRight.drawImage(rightBtn,0,0,96,96);

    document.getElementById("left").addEventListener("touchstart",(e)=>{
        game.pad.goLeft = true;
        ctxLeft.clearRect(0,0,96,96);
        ctxLeft.drawImage(leftBtnP,0,0,96,96);
    })
    document.getElementById("left").addEventListener("touchend",(e)=>{
        game.pad.goLeft = false;
        ctxLeft.clearRect(0,0,96,96)
        ctxLeft.drawImage(leftBtn,0,0,96,96);
    })
    document.getElementById("right").addEventListener("touchstart",(e)=>{
        game.pad.goRight = true;
        ctxRight.clearRect(0,0,96,96);
        ctxRight.drawImage(rightBtnP,0,0,96,96);
    })
    document.getElementById("right").addEventListener("touchend",(e)=>{
        game.pad.goRight = false;
        ctxRight.clearRect(0,0,96,96);
        ctxRight.drawImage(rightBtn,0,0,96,96);
    })
    
}
