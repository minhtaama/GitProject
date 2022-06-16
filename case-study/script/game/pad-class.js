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
        ctx.beginPath();
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