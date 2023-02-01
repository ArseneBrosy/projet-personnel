// Jeu de tir
// by Arsène Brosy
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
// resize canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

OpenMenu("connection");

//#region CONSTANTS
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 30;
const PLAYER_SPEED = 8;
const PLAYER_ROTATE_CHECK_HEIGHT = -PLAYER_HEIGHT / 2;
const OUTSIDE_WALL_WIDTH = 30;
const GRAVITY_FORCE = 1;
const JUMP_FORCE = 21;
const CANON_SIZE = 40;
const CANON_WIDTH = 10;
const PLAYER_SPRITE = new Image();
PLAYER_SPRITE.src = "./images/player.png";
const REMOVE_TIMEOUT = 100;
//#endregion

//#region VARIABLES
//#region PLAYER
var playerX = canvas.width / 2;
var playerY = canvas.height - PLAYER_HEIGHT / 2 - OUTSIDE_WALL_WIDTH;
var playerRotation = 0;
var playerDirection = 0;
var playerVelocityX = 0;
var playerVelocityY = 0;
//#endregion

//#region FIREBASE
var players = [];
var playerKeys = [];
//#endregion

//#region CANON
var canonRotation = 0;
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

// rotate the player around the left or right rotate check
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

walls.push([canvas.width / 2 - 100, 0, canvas.width / 2 + 100, canvas.height / 4])
walls.push([canvas.width / 2 - 300, canvas.height * 0.6 - OUTSIDE_WALL_WIDTH, canvas.width / 2 + 300, canvas.height * 0.6 + OUTSIDE_WALL_WIDTH])

// remove players
var removeCount = 0;

function loop() {
    // resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //#region GRAVITY
    if (!isInWall(playerX, playerY, PLAYER_WIDTH)) {
        playerX += playerVelocityX
        playerY += playerVelocityY;
        playerVelocityY += GRAVITY_FORCE;
    } else {
        playerVelocityX = 0;
        playerVelocityY = 0;
    }
    //#endregion

    //#region CANON
    canonRotation = 360 - Math.atan((playerX - mouseX) / (playerY - mouseY)) / (Math.PI/180);
    //#endregion

    //#region MOVE PLAYER
    playerX += Math.sin((playerRotation - 90) * (Math.PI/180)) * playerDirection;
    playerY -= Math.cos((playerRotation - 90) * (Math.PI/180)) * playerDirection;
    //#endregion

    //#region ROTATE PLAYER
    // checks
    var leftCheckX = playerX + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    var leftCheckY = playerY - Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    var rightCheckX = playerX - Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    var rightCheckY = playerY + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    // center
    var deg = 0;
    while (!isInWall(leftCheckX, leftCheckY) && !isInWall(rightCheckX, rightCheckY) && isInWall(playerX, playerY, PLAYER_WIDTH) && deg < 360) {
        playerRotation ++;
        leftCheckX = playerX + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        leftCheckY = playerY - Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        rightCheckX = playerX - Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        rightCheckY = playerY + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        deg ++;
    }
    // left
    while (isInWall(leftCheckX, leftCheckY) && isInWall(playerX, playerY, PLAYER_WIDTH)) {
        rotateAround(1, 1);
        leftCheckX = playerX + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        leftCheckY = playerY - Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    }
    while (!isInWall(leftCheckX, leftCheckY) && isInWall(playerX, playerY, PLAYER_WIDTH)) {
        rotateAround(-1, 1);
        leftCheckX = playerX + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        leftCheckY = playerY - Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    }
    // right
    while (isInWall(rightCheckX, rightCheckY) && isInWall(playerX, playerY, PLAYER_WIDTH))  {
        rotateAround(-1, 0);
        rightCheckX = playerX - Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        rightCheckY = playerY + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    }
    while (!isInWall(rightCheckX, rightCheckY) && isInWall(playerX, playerY, PLAYER_WIDTH))  {
        rotateAround(1, 0);
        rightCheckX = playerX - Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
        rightCheckY = playerY + Math.cos((playerRotation - 90) * (Math.PI/180)) * PLAYER_WIDTH / 2 + Math.sin((playerRotation - 90) * (Math.PI/180)) * PLAYER_ROTATE_CHECK_HEIGHT;
    }
    //#endregion

    //#region FIREBASE
    if (connectedAccount != "") {
        sendFirebasePosition(connectedAccount, playerX, playerY, playerRotation);
    }

    // recuperer les joueurs
    var listRef = database.ref('players');
    listRef.get().then((snapshot) => {
    if (snapshot.exists()) {
        players = Object.values(snapshot.val());
        playerKeys = Object.keys(snapshot.val());
    }});
    //#endregion

    //#region DRAW
    // walls
    for (var i = 0; i < walls.length; i++) {
        // background
        ctx.fillStyle = "#E2E289";
        ctx.fillRect(walls[i][0] - 1, walls[i][1] - 1, walls[i][2] - walls[i][0] + 2, walls[i][3] - walls[i][1] + 2);
    }

    // canon
    ctx.fillStyle = "blue";
    ctx.translate(playerX, playerY - PLAYER_HEIGHT / 2);
    ctx.rotate(canonRotation * (Math.PI/180));
    //ctx.fillRect(-CANON_WIDTH / 2, -CANON_SIZE / 2, CANON_WIDTH, CANON_SIZE);
    ctx.rotate(-canonRotation * (Math.PI/180));
    ctx.translate(-playerX, -(playerY - PLAYER_HEIGHT / 2));

    // player
    ctx.translate(playerX, playerY);
    ctx.rotate(playerRotation * (Math.PI/180));
    ctx.fillStyle = "red"
    ctx.fillRect(-PLAYER_WIDTH / 2, -PLAYER_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT);
    ctx.fillStyle = "white"
    ctx.fillRect(-PLAYER_WIDTH * 0.4, -PLAYER_HEIGHT * 0.4, 10, 10);
    ctx.fillRect(PLAYER_WIDTH * 0.4 - 10, -PLAYER_HEIGHT * 0.4, 10, 10);
    ctx.rotate(-playerRotation * (Math.PI/180));
    ctx.translate(-playerX, -playerY);

    // other players
    for (var i = 0; i < players.length; i ++) {
        if (playerKeys[i] != connectedAccount) {
            ctx.translate(players[i].x, players[i].y);
            ctx.rotate(players[i].r * (Math.PI/180));
            ctx.fillStyle = "blue"
            ctx.fillRect(-PLAYER_WIDTH / 2, -PLAYER_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT);
            ctx.fillStyle = "white"
            ctx.fillRect(-PLAYER_WIDTH * 0.4, -PLAYER_HEIGHT * 0.4, 10, 10);
            ctx.fillRect(PLAYER_WIDTH * 0.4 - 10, -PLAYER_HEIGHT * 0.4, 10, 10);
            ctx.rotate(-players[i].r * (Math.PI/180));
            ctx.translate(-players[i].x, -players[i].y);

            // pseudo
            ctx.fillStyle = "black";
            ctx.font = "bold 20px Segoe UI";
            ctx.fillText(playerKeys[i], players[i].x - playerKeys[i].length * 5, players[i].y - PLAYER_HEIGHT);
        }
    }
    //#endregion

    //#region REMOVE PLAYERS
    removeCount ++;
    if (removeCount > REMOVE_TIMEOUT) {
        removeCount = 0;
        deletePlayers();
    }
    //#endregion

    requestAnimationFrame(loop);
}

//position de la souris
canvas.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
document.addEventListener('keydown', function(e) {
    if (e.which === 65) {
        playerDirection = PLAYER_SPEED;
    }
    if (e.which === 68) {
        playerDirection = -PLAYER_SPEED;
    }
    if (e.which === 32) {
        playerX += Math.sin((playerRotation) * (Math.PI/180)) * PLAYER_WIDTH * 1.5
        playerY -= Math.cos((playerRotation) * (Math.PI/180)) * PLAYER_WIDTH * 1.5;
        playerVelocityY = -Math.cos((playerRotation) * (Math.PI/180)) * JUMP_FORCE;
        playerVelocityX = Math.sin((playerRotation) * (Math.PI/180)) * JUMP_FORCE;
    }
});
document.addEventListener('keyup', function(e) {
    if (e.which === 65 || e.which === 68) {
        playerDirection = 0;
    }
});

// start game
requestAnimationFrame(loop);