let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d")
let ball = new Image();
ball.src = "bouncy-ball.png";
ball.onload = function(){
    ctx.drawImage(ball,5,10,100,100);
}
