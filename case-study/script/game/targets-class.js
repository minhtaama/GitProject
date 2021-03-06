class Tar{
    constructor(x,y,width,height,isWall){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.spHorizon = 0;
        this.spVertical = 1;
        this.goDown = false;
        this.isWall = isWall;
    }
    display() {
        ctx.beginPath();
        if(!this.isWall){
            ctx.drawImage(tarImg,this.x,this.y,this.width,this.height);
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
        this.level;
    }
    setMaxInRow(yPos, ...args) {
        let x = 0;
        const WIDTH = canvas.width/args.length;
        for(let j = 0; j < args.length; j++){
            if (args[j] == 1) {
                this.array.push(new Tar(x,yPos,WIDTH,WIDTH,true)); //wall
            } else if(args[j]==2) {
                this.array.push(new Tar(x,yPos,WIDTH,WIDTH,false)); //target
            } else if(args[j]==0) {
                this.array.push(0);
            }
            x += WIDTH;
        }
        this.yEachRow+=WIDTH;
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
