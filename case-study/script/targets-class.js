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
            if(typeof this.array[i] == "object") {
                this.array[i].display();
                this.array[i].move();
            }
        }
    }
}