///////// RUN THE GAME /////////
window.onload = function() {

    let game = new BouncingBall(160);
    game.balls.array.push(new Bal(11, "no-power"));
    game.pad.getCoordinates(canvas.width/2-game.pad.width/2);
    game.balls.array[0].getCoordinates(canvas.width/2,game.pad.y-game.balls.array[0].radius);
    chooseLevel(level1,game);
    
    function animate(){
            game.display();
            game.renderScore();
            requestAnimationFrame(animate);
    }
    animate();



    ///RENDER BUTTON
    document.getElementById("btn").addEventListener("click", ()=> {
        game = new BouncingBall(160);
        game.balls.array.push(new Bal(11, "no-power"));
        game.pad.getCoordinates(canvas.width/2-game.pad.width/2);
        game.balls.array[0].getCoordinates(canvas.width/2,game.pad.y-game.balls.array[0].radius);
        chooseLevel(level1,game);
        if(!game.balls.isPlaying) {
            game.balls.isPlaying = true;
        }
    })

    ctxLeft.beginPath();
    ctxLeft.drawImage(leftBtn,0,0,96,96);
    ctxRight.beginPath();
    ctxRight.drawImage(rightBtn,0,0,96,96);
    ctxFire.beginPath();
    ctxFire.drawImage(fireBtn,0,0,96,96);

    ["touchstart","mousedown"].forEach(val => {
        document.getElementById("left").addEventListener(val,()=>{
            game.pad.goLeft = true;
            ctxLeft.clearRect(0,0,96,96);
            ctxLeft.beginPath();
            ctxLeft.drawImage(leftBtnP,0,0,96,96);
        });
    });

    ["touchend","mouseup"].forEach(val => {
        document.getElementById("left").addEventListener(val,()=>{
            game.pad.goLeft = false;
            ctxLeft.clearRect(0,0,96,96);
            ctxLeft.beginPath();
            ctxLeft.drawImage(leftBtn,0,0,96,96);
        });
    });
    
    ["touchstart","mousedown"].forEach(val => {
        document.getElementById("fire").addEventListener(val,()=>{
            ctxFire.clearRect(0,0,96,96);
            ctxFire.beginPath();
            ctxFire.drawImage(fireBtnP,0,0,96,96);
        });
    });

    ["touchend","mouseup"].forEach(val => {
        document.getElementById("fire").addEventListener(val,()=>{
            ctxFire.clearRect(0,0,96,96);
            ctxFire.beginPath();
            ctxFire.drawImage(fireBtn,0,0,96,96);
        });
    });

    ["touchstart","mousedown"].forEach(val => {
        document.getElementById("right").addEventListener(val,()=>{
            game.pad.goRight = true;
            ctxRight.clearRect(0,0,96,96);
            ctxRight.beginPath();
            ctxRight.drawImage(rightBtnP,0,0,96,96);
        });
    });

    ["touchend","mouseup"].forEach(val => {
        document.getElementById("right").addEventListener(val,()=>{
            game.pad.goRight = false;
            ctxRight.clearRect(0,0,96,96);
            ctxRight.beginPath();
            ctxRight.drawImage(rightBtn,0,0,96,96);
        });
    });
    
    document.addEventListener("keydown",(e)=>{
        if(e.key == "ArrowLeft") {
            game.pad.goLeft = true;
            ctxLeft.clearRect(0,0,96,96);
            ctxLeft.beginPath();
            ctxLeft.drawImage(leftBtnP,0,0,96,96);
        }
        if(e.key == "ArrowRight") {
            game.pad.goRight = true;
            ctxRight.clearRect(0,0,96,96);
            ctxRight.beginPath();
            ctxRight.drawImage(rightBtnP,0,0,96,96);
        }
    })
    document.addEventListener("keyup", (e) => {
        if (e.key == "ArrowLeft") {
            game.pad.goLeft = false;
            ctxLeft.clearRect(0,0,96,96);
            ctxLeft.beginPath();
            ctxLeft.drawImage(leftBtn,0,0,96,96);
        }
        if (e.key == "ArrowRight") {
            game.pad.goRight = false;
            ctxRight.clearRect(0,0,96,96);
            ctxRight.beginPath();
            ctxRight.drawImage(rightBtn,0,0,96,96);
        }
    })
}
