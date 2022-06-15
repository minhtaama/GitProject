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
        ctx.beginPath();
        switch(this.power) {
            case "add-ball":
                ctx.drawImage(trsureAddBallImg,this.x,this.y,this.width,this.height);;
                break;
            case "rocket":
                ctx.drawImage(trsureRocketImg,this.x,this.y,this.width,this.height);;
                break;
        }
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