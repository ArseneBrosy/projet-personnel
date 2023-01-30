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
const PLAYER_ROTATE_CHECK_HEIGHT = -15;
const OUTSIDE_WALL_WIDTH = 30;
//#endregion

//#region VARIABLES
//#region PLAYER
var playerX = canvas.width / 2;
var playerY = canvas.height - PLAYER_HEIGHT / 2 - OUTSIDE_WALL_WIDTH;
var playerRotation = 0;
var playerVelocityX = 0;
//#endregion

//#region MOUSE
var mouseX = 0;
var mouseY = 0;
//#endregion

//#region walls
var walls = []
//#endregion
//#endregion

//#region FUNCTIONS
// check if an x, y coord is in a wall (adjustable margin)
function isInWall(x, y, margin = 0) {
    var result = false;
    for (var i = 0; i < walls.length; i++) {
        if (x >= walls[i][0] - margin && x <= walls[i][2] + margin && y >= walls[i][1] - margin && y <= walls[i][3] + margin) {
            result = true;
        }
    }
    return result;
}

function rotateAround(deg, pos) {
    if (pos === 0) {
        var startX = playerX + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        var startY = playerY - Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        playerRotation += deg
        playerX = startX + Math.cos((playerRotation) * (Math.PI/180)) * PLAYER_WIDTH / 2 - Math.cos((90 - playerRotation) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        playerY = startY + Math.sin((playerRotation) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((90 - playerRotation) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    }
    if (pos === 1) {
        var startX = playerX - Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        var startY = playerY + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        playerRotation += deg
        playerX = startX + Math.cos((playerRotation + 180) * (Math.PI/180)) * PLAYER_WIDTH / 2 - Math.cos((90 - playerRotation + 180) * (Math.PI/180)) * -PLAYER_ROTATE_CHECK_HEIGHT;
        playerY = startY + Math.sin((playerRotation + 180) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((90 - playerRotation + 180) * (Math.PI/180)) * -PLAYER_ROTATE_CHECK_HEIGHT;
    }
}
//#endregion

// create outside walls
walls.push([0, 0, OUTSIDE_WALL_WIDTH, canvas.height]);
walls.push([canvas.width - OUTSIDE_WALL_WIDTH, 0, canvas.width, canvas.height]);
walls.push([0, 0, canvas.width, OUTSIDE_WALL_WIDTH]);
walls.push([0, canvas.height - OUTSIDE_WALL_WIDTH, canvas.width, canvas.height]);

walls.push([canvas.width / 2 - OUTSIDE_WALL_WIDTH, 0, canvas.width / 2 + OUTSIDE_WALL_WIDTH, 300])

function loop() {
    // resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //#region MOVE PLAYER
    playerX += Math.sin((playerRotation - 90) * (Math.PI/180)) * playerVelocityX;
    playerY -= Math.cos((playerRotation - 90) * (Math.PI/180)) * playerVelocityX;
    //#endregion

    //#region ROTATE PLAYER
    // left
    var leftCheckX = playerX + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    var leftCheckY = playerY - Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    while (isInWall(leftCheckX, leftCheckY)) {
        rotateAround(1, 1);
        leftCheckX = playerX + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        leftCheckY = playerY - Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    }
    while (!isInWall(leftCheckX, leftCheckY)) {
        rotateAround(-1, 1);
        leftCheckX = playerX + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        leftCheckY = playerY - Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    }
    // left
    var rightCheckX = playerX - Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    var rightCheckY = playerY + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    while (isInWall(rightCheckX, rightCheckY))  {
        rotateAround(-1, 0);
        rightCheckX = playerX - Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        rightCheckY = playerY + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    }
    while (!isInWall(rightCheckX, rightCheckY))  {
        rotateAround(1, 0);
        rightCheckX = playerX - Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        rightCheckY = playerY + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    }
    //#endregion

    //#region DRAW
    // walls
    for (var i = 0; i < walls.length; i++) {
        // background
        ctx.fillStyle = "#E2E289";
        ctx.fillRect(walls[i][0] - 1, walls[i][1] - 1, walls[i][2] - walls[i][0] + 2, walls[i][3] - walls[i][1] + 2);
    }

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