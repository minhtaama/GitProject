let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

class Ball {
    constructor (radius) {
        this.radius = radius;
        this.x;
        this.y;
        this.xFlag = 0; //0: move left, 1: move right
        this.yFlag = 0; //0: move up, 1: move down
        this.touchBorderBottom = 0;
        this.speedVertical = Math.sqrt(12.5);
        this.speedHorizontal = Math.sqrt(12.5);
    }
    getCoordinates(x,y) {
        this.x = x;
        this.y = y;
    }
    display() {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill()
    }
    ifTouchBorder() {
        if(this.x - this.radius <= 0) { //if touch left
            this.xFlag = 1;
        }
        if(this.x + this.radius >= canvas.width-1) { //if touch right
            this.xFlag = 0;
        }
        if(this.y - this.radius <= 0) { //if touch top
            this.yFlag = 1;
        }
        if(this.y + this.radius >= canvas.height) { //if touch bottom
            this.touchBorderBottom = 1;
            this.yFlag = 0;
        }
    }
    move(){
        this.ifTouchBorder();
        if (this.speedVertical >= 0) {
            if(this.xFlag == 1) {
                this.x += this.speedVertical; //move right
            }
        } else this.x -= this.speedVertical;
        if(this.speedVertical >= 0) {
        if(this.xFlag == 0) {
            this.x -= this.speedVertical; //move left
        }
        } else this.x += this.speedVertical;
        if(this.yFlag == 1) {
            this.y += this.speedHorizontal; //move bottom
        }
        if(this.yFlag == 0) {
            this.y -= this.speedHorizontal; //move top
        }
    }
}

class Pad {
    constructor (width, height) {
        this.width = width;
        this.height = height;
        this.x;
        this.y = 450;
        this.goLeft = false;
        this.goRight = false;
        this.speed = 5;
    }
    getCoordinates(x) {
        this.x = x;
    }
    getCenterCoordinates() {
        this.xCen = this.x + this.width/2;
        this.yCen = this.y + this.height/2;
    }
    display() {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    move(){
        if(this.goLeft && this.x > 0) {
            this.x -= this.speed;
        }
        if(this.goRight && (this.x + this.width) < canvas.width) {
            this.x += this.speed;
        }
        this.getCenterCoordinates();
    }
}

class Target{
    constructor(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    display() {
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    getCenterCoordinates() {
        this.xCen = this.x + this.width / 2;
        this.yCen = this.y + this.height / 2;
    }
}

class Targets {
    constructor() {
        this.array = [];
    }
    setTargets(number) {
        
    }
    display(){
        
    }
}


class BouncingBall {
    constructor (ballRadius,padWidth,padHeight) {
        this.ball = new Ball(ballRadius);
        this.pad = new Pad(padWidth,padHeight);
    }
    display() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        this.isBallTouch(this.pad);
        this.pad.move();
        this.ball.move();
        //this.changeBallSpeed()
        this.pad.display();
        this.ball.display();
        console.log(this.ballActualSpeed,this.ball.speedVertical, this.ball.speedHorizontal);
    }
    getBallSpeed() {
        this.ballActualSpeed = Math.sqrt(this.ball.speedHorizontal**2 + this.ball.speedVertical**2);
    }
    changeBallSpeed(){
        if (this.isBallTouch(this.pad)) {
            if (this.pad.goRight) {
                this.getBallSpeed();
                if(this.ball.speedVertical + 0.5 < this.ballActualSpeed) {
                    this.ball.speedVertical += 0.5;
                } else this.ball.speedVertival += this.ballActualSpeed - this.ball.speedVertical - 0.1;
            } else if (this.pad.goLeft) {
                this.getBallSpeed();
                if(this.ball.speedVertical - 0.5 > -this.ballActualSpeed) {
                    this.ball.speedVertical -= 0.5;
                } else this.ball.speedVertival -= this.ballActualSpeed - this.ball.speedVertical - 0.1;
            }
            this.ball.speedHorizontal = Math.sqrt(this.ballActualSpeed**2 - this.ball.speedVertical**2)
        }
    }
    isBallTouch(target) {
        if (target.yCen - this.ball.y > 0) {
            //touch top side
            if (target.yCen - this.ball.y <= this.ball.radius + target.height / 2) {
                if (this.ball.x <= target.width + target.x && this.ball.x >= target.x) {
                    this.ball.yFlag = 0;
                    return true;
                }
            } else return false;
        } else {
            //touch bottom side
            if (this.ball.y - target.yCen <= this.ball.radius + target.height / 2) {
                if (this.ball.x <= target.width + target.x && this.ball.x >= target.x) {
                    this.ball.yFlag = 1;
                    return true;
                }
            } else return false;
        }
        if (target.xCen - this.ball.x > 0) {
            //touch left side
            if (target.xCen - this.ball.x <= this.ball.radius + target.width / 2) {
                if (this.ball.y <= target.height + target.y && this.ball.y >= target.y) {
                    this.ball.xFlag = 0;
                    return true;
                }
            } else return false;
        } else {
            //touch right side
            if (this.ball.x - target.xCen <= this.ball.radius + target.width / 2) {
                if (this.ball.y <= target.height + target.y && this.ball.y >= target.y) {
                    this.ball.xFlag = 1;
                    return true;
                }
            } else return false;
        }
    }
}

let game = new BouncingBall(6,100,50);
game.pad.getCoordinates(canvas.width/2-game.pad.width/2);
game.ball.getCoordinates(canvas.width/2,180-game.pad.height);
game.getBallSpeed();

function animate(){
    game.display();
    requestAnimationFrame(animate);
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


document.addEventListener("keyup", (e)=> {
    if(e.key == "ArrowLeft") {
        game.pad.goLeft = false;
    }
    if(e.key == "ArrowRight") {
        game.pad.goRight = false;
    }
})
