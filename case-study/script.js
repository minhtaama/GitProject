let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

class Ball {
    constructor (radius) {
        this.radius = radius;
        this.x;
        this.y;
        this.xFlag = 0;
        this.yFlag = 0;
        this.touchBorderBottom = 0;
        this.speed = 1;
    }
    getCoordinates(x,y) {
        this.x = x;
        this.y = y;
    }
    display(x,y) {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill()
    }
    checkFlag() {
        if(this.x - this.radius <= 0) { //if touch left
            this.xFlag = 1;
        }
        if(this.x + this.radius >= canvas.width) { //if touch right
            this.xFlag = 0;
        }
        if(this.y - this.radius <= 0) { //if touch top
            this.yFlag = 1;
        }
        if(this.y + this.radius >= canvas.height) { //if touch bottom
            this.yFlag = 0;
            this.touchBorderBottom = 1;
        }
    }
    moveBall(){
        this.checkFlag();
        if(this.xFlag == 1) {
            this.x += this.speed; //move right
        }
        if(this.xFlag == 0) {
            this.x -= this.speed; //move left
        }
        if(this.yFlag == 1) {
            this.y += this.speed; //move bottom
        }
        if(this.yFlag == 0) {
            this.y -= this.speed; //move top
        }
    }
}

class Pad {
    constructor (width, height) {
        this.width = width;
        this.height = height;
        this.x;
        this.y = 350;
        this.goLeft = false;
        this.goRight = false;
    }
    getCoordinates(x) {
        this.x = x;
    }
    display() {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    moveLeft(speed) {
        this.x -= speed;
    }
    moveRight(speed) {
        this.x += speed;
    }
}

class BouncingBall {
    constructor (ballRadius,padWidth,padHeight) {
        this.ball = new Ball(ballRadius);
        this.pad = new Pad(padWidth,padHeight);
        // this.target = new Target()
    }
    display() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        this.ball.moveBall();
        this.pad.display();
        this.ball.display();
    }
}

let game = new BouncingBall(10,100,10);
game.pad.getCoordinates(canvas.width/2-game.pad.width/2);
game.ball.getCoordinates(canvas.width/2,350-game.pad.height);

function animate(){
    if(game.pad.goLeft) {
        game.pad.moveLeft(2);
    } 
    if(game.pad.goRight) {
        game.pad.moveRight(2);
    }
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

document.getElementById("left").addEventListener("mousedown",(e)=>{
    game.pad.goLeft = true;
})
document.getElementById("left").addEventListener("mouseup",(e)=>{
    game.pad.goLeft = false;
})
document.getElementById("right").addEventListener("mousedown",(e)=>{
    game.pad.goRight = true;
})
document.getElementById("right").addEventListener("mouseup",(e)=>{
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