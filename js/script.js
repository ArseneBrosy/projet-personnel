// Jeu de tir
// by Arsène Brosy
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

// resize canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//#region CONSTANTS
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 30;
const PLAYER_SPEED = 10;
//#endregion

//#region VARIABLES
//#region PLAYER
var playerX = canvas.width / 2;
var playerY = canvas.height - PLAYER_HEIGHT / 2;
var playerRotation = 0;
var playerVelocityX = 0;
//#endregion

//#region MOUSE
var mouseX = 0;
var mouseY = 0;
//#endregion
//#endregion

function loop() {
    // resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //#region MOVE PLAYER
    playerX += Math.sin((playerRotation - 90) * (Math.PI/180)) * playerVelocityX;
    playerY -= Math.cos((playerRotation - 90) * (Math.PI/180)) * playerVelocityX;
    //#endregion

    //#region DRAW
    // player
    ctx.fillStyle = "red";
    ctx.translate(playerX, playerY);
    ctx.rotate(playerRotation * (Math.PI/180));
    ctx.fillRect(-PLAYER_WIDTH / 2, -PLAYER_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT);
    ctx.rotate(-playerRotation * (Math.PI/180));
    ctx.translate(-playerX, -playerY);

    // mouse
    ctx.fillStyle = "green";
    ctx.fillRect(mouseX - 10, mouseY - 10, 20, 20);
    //#endregion

    requestAnimationFrame(loop);
}

//position de la souris
canvas.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
document.addEventListener('keydown', function(e) {
    // player 1
    if (e.which === 65) {
        playerVelocityX = PLAYER_SPEED;
    }
    if (e.which === 68) {
        playerVelocityX = -PLAYER_SPEED;
    }
});
document.addEventListener('keyup', function(e) {
    // player 1
    if (e.which === 65 || e.which === 68) {
        playerVelocityX = 0;
    }
});

// start game
requestAnimationFrame(loop);