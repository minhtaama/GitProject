let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

class Ball {
    constructor (radius) {
        this.radius = radius;
        this.x;
        this.y;
        this.xFlag = 0; //0: move left, 1: move right
        this.yFlag = 0; //0: move up, 1: move down
        this.spHorizon = Math.sqrt(2);
        this.spVertical = Math.sqrt(2);
        this.touchBorderBottom = 0;
        this.xT;        //coordinates of nearest touch point on target
        this.yT;        //
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
        ///drawRange///
            ctx.beginPath();
            ctx.arc(this.xT,this.yT,2,0,2*Math.PI);
            ctx.fillStyle = "blue";
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(this.x,this.y);
            ctx.lineTo(this.xT,this.yT);
            ctx.strokeStyle = "gray";
            ctx.stroke();
        //////////////
        range = Math.sqrt((this.x - this.xT)**2 + (this.y - this.yT)**2) - this.radius;
        if (range <= 0) {
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
            console.log("touched")
            return true;
        } else return false;
    }
    modDirection(target) {
        this.getSpeed();        //this.speed always a CONST
        if(target.goLeft) {
            switch(this.xFlag) {
                case 0:
                    this.spHorizon += (this.speed - this.spHorizon)/3;
                    break;
                case 1:
                    this.spHorizon -= this.spHorizon/3;
                    break;
            }
            this.spVertical = Math.sqrt(this.speed**2 - this.spHorizon**2);
            console.log("ball speed:",this.speed," /ball => vector:", this.spHorizon, "/ ball ^ vector:", this.spVertical);
        }
        if(target.goRight) {
            switch(this.xFlag) {
                case 0:
                    this.spHorizon -= this.spHorizon/3;
                    break;
                case 1:
                    this.spHorizon += (this.speed - this.spHorizon)/3;
                    break;
            }
            this.spVertical = Math.sqrt(this.speed**2 - this.spHorizon**2);
            console.log("ball speed:",this.speed," /ball => vector:", this.spHorizon, "/ ball ^ vector:", this.spVertical);
        }
    }
    whenTouch(target) {
        if(this.isTouch(target)) {
            //switch move up/down and move left/right
            switch(this.xT) {
                case target.x:
                    this.xFlag = 0;
                    break;
                case target.x + target.width:
                    this.xFlag = 1;
            }
            switch(this.yT) {
                case target.y:
                    this.yFlag = 0;
                    break;
                case target.y + target.height:
                    this.yFlag = 1;
            }
            this.modDirection(target);
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
        if(this.y + this.radius >= canvas.height) {     //if touch bottom
            this.touchBorderBottom = 1;
            this.yFlag = 0;
        }
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
        ctx.fillStyle = "blue";
        ctx.fill()
    }
}

class Pad {
    constructor (width) {
        this.width = width;
        this.height = 10;
        this.x;
        this.y = canvas.height - 40;
        this.spVertical = 0;
        this.spHorizon = 5;
        this.goLeft = false;
        this.goRight = false;
        // this.goUp = false;
        // this.goDown = false;
    }
    getCoordinates(x) {
        this.x = x;
    }
    move(){
        if(this.goLeft && this.x > 0) {
            this.x -= this.spHorizon;
        }
        if(this.goRight && (this.x + this.width) < canvas.width) {
            this.x += this.spHorizon;
        }
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}

class Target{
    constructor(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.spHorizon = 0;
        this.spVertical = 0;
    }
    display() {
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.fillRect(this.x,this.y,this.width,this.height);
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
    constructor (ballRadius,padWidth) {
        this.ball = new Ball(ballRadius);
        this.pad = new Pad(padWidth);
        this.target = new Target(50,30,10,100)
    }
    display() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        this.ball.whenTouch(this.pad);
        this.ball.whenTouch(this.target);
        this.ball.whenTouchBorder();
        this.target.display();
        this.pad.move();
        this.ball.move();
    }
}

let game = new BouncingBall(6,100,20);
game.pad.getCoordinates(canvas.width/2-game.pad.width/2);
game.ball.getCoordinates(canvas.width/2,180-game.pad.height);
game.ball.getSpeed();

function animate(){
    game.display();
    requestAnimationFrame(animate);
}
animate();
console.log(game.ball.spHorizon,game.ball.spVertical)

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
