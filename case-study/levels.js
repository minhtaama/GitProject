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
            ctx.fillStyle = "green";
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
            this.spVertical += 0.3;
            this.y += this.spVertical;
        }
    }
}

class Targets {
    constructor() {
        this.array = [];
        this.yEachRow = 0;
        this.tarHeight = 15;
        this.level;
    }
    setMaxInRow(number, yPos, ...args) {
        let x = 0;
        const WIDTH = canvas.width/number;
        for(let i = 0; i < number; i++) {
            for(let j = 0; j < args.length; j++){
                if (args[j] == 1) {
                this.array.push(new Tar(x,yPos,WIDTH,this.tarHeight,true)); //wall
                } else if(args[j]==2) {
                    this.array.push(new Tar(x,yPos,WIDTH,this.tarHeight,false)); //target
                } else this.array.push(0);
                x += WIDTH;
            }
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