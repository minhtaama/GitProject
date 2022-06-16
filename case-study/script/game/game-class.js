class BouncingBall {
    constructor (padWidth) {
        this.balls = new Balls();
        this.pad = new Pad(padWidth);
        this.targets = new Targets();
        this.powers = new Powers();
        this.isWin = false;
        this.score;
    }
    display() {
        if(!this.isWin && this.balls.isPlaying){
            this.checkWin();
            ctx.beginPath();
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(backgrdImg,0,0,canvas.width,canvas.height)
            this.targets.display();
            this.balls.display(this.pad,this.targets,this.powers);
            this.powers.display(this.pad,this.balls);
            this.pad.move();
        } else if(this.isWin) {
            ctx.beginPath();
            ctx.fillStyle = "blue";
            ctx.fillRect(30,30,canvas.width,canvas.height);
            if(this.score > localStorage.getItem(`level-${localStorage.getItem("level")}`)) {
                localStorage.setItem(`level-${localStorage.getItem("level")}`, this.score);
            }
        } else if(!this.isWin && !this.balls.isPlaying) {
            ctx.beginPath();
            ctx.fillStyle = "green";
            ctx.fillRect(30,30,canvas.width,canvas.height);
            if(this.score > localStorage.getItem(`level-${localStorage.getItem("level")}`)) {
                localStorage.setItem(`level-${localStorage.getItem("level")}`, this.score);
            }
        }
    }

    renderScore() {
        let targets = this.targets.array.filter((el,idx,arr) => {
            return el == -2;
        })
        let wall = this.targets.array.filter((el,idx,arr) => {
            return el == -1;
        })
        let currballs = this.balls.array.filter((el,idx,arr) => {
            return typeof el == "object";
        })
        document.getElementById("score").innerHTML = `Score: ${targets.length + wall.length*50}`;
        document.getElementById("balls").innerHTML = `Current Balls: ${currballs.length}`;
        this.score = (targets.length + wall.length*50) * (currballs.length?currballs.length:1);
    }

    chooseLevel(num) {
            document.getElementById("level").innerHTML = levels[num-1].name;
            backgrdImg.src = levels[num-1].src;
            for (let i = 0; i < levels[num-1].display.length; i++) {
                this.targets.setMaxInRow(this.targets.yEachRow, ...levels[num-1].display[i]);
            }
    }

    checkWin() {
        let filter = this.targets.array.filter(el => {
            return el.isWall == false;
        })
        if (filter.length == 0) {
            return this.isWin = true;
        } else this.isWin = false;
    }
}
