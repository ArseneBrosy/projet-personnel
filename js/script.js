// Jeu de tir
// by Arsène Brosy
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

// resize canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//#region CONSTANTS
const PLAYER_WIDTH = 50;
const PLAER_HEIGHT = 30;
//#endregion

//#region VARIABLES
//#region PLAYER
var playerX = canvas.width / 2;
var playerY = 0;
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

    //#region DRAW
    // player
    ctx.fillStyle = "red";
    ctx.fillRect(playerX - (PLAYER_WIDTH / 2), canvas.height - playerY - PLAER_HEIGHT, PLAYER_WIDTH, PLAER_HEIGHT);

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

// start game
requestAnimationFrame(loop);