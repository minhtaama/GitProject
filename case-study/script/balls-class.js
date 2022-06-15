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
                    if(Math.floor(Math.random() * 11) >= 8) {       //percentage of spawning powers
                        let j = Math.floor(Math.random()*7);
                        switch(j) {
                            case 0: case 1: case 2: case 3: case 4: case 5:
                                this.spawnPower(powers, targets[i],"add-ball");
                                break;
                            case 6:
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
                        break;
                    case "rocket":
                        if(targets[i].isWall) {
                            targets[i] = -1;
                        } else targets[i] = -2;
                        break;
                }
            }
            if (targets[i].y >= canvas.height && !targets[i].canTouch) {
                if(targets[i].isWall) {
                    targets[i] = -1;
                } else targets[i] = -2;
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
        this.isPlaying = false;
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
                }
            }
        }
    }
}