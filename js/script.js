// Jeu de tir
// by Arsène Brosy
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
// resize canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

OpenMenu("connection");
deletePlayers();

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
const REMOVE_TIMEOUT = 500;
const BASE_LIFE = 5;
//#endregion

//#region VARIABLES
var mapHeight = 700;
var mapWidth = 1400;
//#region PLAYER
var playerX = mapWidth / 2;
var playerY = mapHeight - PLAYER_HEIGHT / 2 - OUTSIDE_WALL_WIDTH;
var playerRotation = 0;
var playerDirection = 0;
var playerVelocityX = 0;
var playerVelocityY = 0;
var life = BASE_LIFE;
var killer = "";
//#endregion

//#region FIREBASE
var players = [];
var playerKeys = [];
var otherBullets = [];
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
var mapId = 0;
//#endregion

//#region bullets
var bullets = [];
const BULLET_SPEED = 25;
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

//
function playerSin() {
    return Math.sin(playerRotation * (Math.PI/180));
}
function playerCos() {
    return Math.cos(playerRotation * (Math.PI/180));
}

// rotate the player around the left or right rotate check
function rotateAround(deg, pos) {
    if (pos === 0) {
        var startX = playerX + playerCos() * -1 * PLAYER_WIDTH / 2 + playerSin() * PLAYER_ROTATE_CHECK_HEIGHT;
        var startY = playerY - playerSin() * PLAYER_WIDTH / 2 + playerCos() * -1 * PLAYER_ROTATE_CHECK_HEIGHT;
        playerRotation += deg
        playerX = startX + playerCos() * PLAYER_WIDTH / 2 - playerSin() * PLAYER_ROTATE_CHECK_HEIGHT;
        playerY = startY + playerSin() * PLAYER_WIDTH / 2 + playerCos() * PLAYER_ROTATE_CHECK_HEIGHT;
    }
    if (pos === 1) {
        var startX = playerX - playerCos() * -1 * PLAYER_WIDTH / 2 + playerSin() * PLAYER_ROTATE_CHECK_HEIGHT;
        var startY = playerY + playerSin() * PLAYER_WIDTH / 2 + playerCos() * -1 * PLAYER_ROTATE_CHECK_HEIGHT;
        playerRotation += deg
        playerX = startX + playerCos() * -1 * PLAYER_WIDTH / 2 - playerSin() * -1 * -PLAYER_ROTATE_CHECK_HEIGHT;
        playerY = startY + playerSin() * -1 * PLAYER_WIDTH / 2 + playerCos() * -1 * -PLAYER_ROTATE_CHECK_HEIGHT;
    }
}

// shoot a bullet
function shoot() {
    bullets.push([playerX, playerY, canonRotation]);
}
//#endregion

//#region CREATE MAP
// outside walls
walls.push([0, 0, OUTSIDE_WALL_WIDTH, mapHeight]);
walls.push([mapWidth - OUTSIDE_WALL_WIDTH, 0, mapWidth, mapHeight]);
walls.push([0, 0, mapWidth, OUTSIDE_WALL_WIDTH]);
walls.push([0, mapHeight - OUTSIDE_WALL_WIDTH, mapWidth, mapHeight]);

// maps
switch (mapId) {
    case 0:
        // top box
        walls.push([mapWidth / 2 - 100, 0, mapWidth / 2 - 100 + OUTSIDE_WALL_WIDTH * 2, mapHeight / 4])
        walls.push([mapWidth / 2 - 100, mapHeight / 4 - OUTSIDE_WALL_WIDTH * 2, mapWidth / 2 + 100, mapHeight / 4])

        // center plateform
        walls.push([mapWidth / 2 - 300 + OUTSIDE_WALL_WIDTH * 4, mapHeight * 0.6 - OUTSIDE_WALL_WIDTH, mapWidth / 2 + 300 - OUTSIDE_WALL_WIDTH * 4, mapHeight * 0.6 + OUTSIDE_WALL_WIDTH])
        walls.push([mapWidth / 2 + 300 - OUTSIDE_WALL_WIDTH * 2, mapHeight * 0.6 - OUTSIDE_WALL_WIDTH, mapWidth / 2 + 300, mapHeight * 0.6 + OUTSIDE_WALL_WIDTH])
        walls.push([mapWidth / 2 - 300, mapHeight * 0.6 - OUTSIDE_WALL_WIDTH, mapWidth / 2 - 300 + OUTSIDE_WALL_WIDTH * 2, mapHeight * 0.6 + OUTSIDE_WALL_WIDTH])

        // corner
        walls.push([mapWidth - OUTSIDE_WALL_WIDTH * 4, mapHeight - OUTSIDE_WALL_WIDTH * 4, mapWidth, mapHeight]);

        // left box
        walls.push([0, 200, OUTSIDE_WALL_WIDTH * 4, 300]);
        break;
    case 1:
        // cross
        walls.push([mapWidth / 2 - OUTSIDE_WALL_WIDTH, OUTSIDE_WALL_WIDTH * 3, mapWidth / 2 + OUTSIDE_WALL_WIDTH, mapHeight - OUTSIDE_WALL_WIDTH * 3]);
        walls.push([OUTSIDE_WALL_WIDTH * 3, mapHeight / 2 - OUTSIDE_WALL_WIDTH, mapWidth - OUTSIDE_WALL_WIDTH * 3, mapHeight / 2 + OUTSIDE_WALL_WIDTH]);

        // dots
        walls.push([mapWidth * .25 - OUTSIDE_WALL_WIDTH * 2, mapHeight * .25 - OUTSIDE_WALL_WIDTH * 2, mapWidth * .25 + OUTSIDE_WALL_WIDTH * 2, mapHeight * .25 + OUTSIDE_WALL_WIDTH * 2])
        walls.push([mapWidth * .75 - OUTSIDE_WALL_WIDTH * 1, mapHeight * .25 - OUTSIDE_WALL_WIDTH * 1, mapWidth * .75 + OUTSIDE_WALL_WIDTH * 1, mapHeight * .25 + OUTSIDE_WALL_WIDTH * 1])
        walls.push([mapWidth * .75 - OUTSIDE_WALL_WIDTH * 1.5, mapHeight * .75 - OUTSIDE_WALL_WIDTH * 1.5, mapWidth * .75 + OUTSIDE_WALL_WIDTH * 1.5, mapHeight * .75 + OUTSIDE_WALL_WIDTH * 1.5])
        walls.push([mapWidth * .25 - OUTSIDE_WALL_WIDTH * 2.5, mapHeight * .75 - OUTSIDE_WALL_WIDTH * 2.5, mapWidth * .25 + OUTSIDE_WALL_WIDTH * 2.5, mapHeight * .75 + OUTSIDE_WALL_WIDTH * 2.5])
        break;
}
//#endregion

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

    //#region MOVE PLAYER
    playerX += playerCos() * -1 * playerDirection;
    playerY -= playerSin() * playerDirection;
    //#endregion

    //#region ROTATE PLAYER
    // checks
    var leftCheckX = playerX + playerCos() * -1 * PLAYER_WIDTH / 2 + playerSin() * PLAYER_ROTATE_CHECK_HEIGHT;
    var leftCheckY = playerY - playerSin() * PLAYER_WIDTH / 2 + playerCos() * -1 * PLAYER_ROTATE_CHECK_HEIGHT;
    var rightCheckX = playerX - playerCos() * -1 * PLAYER_WIDTH / 2 + playerSin() * PLAYER_ROTATE_CHECK_HEIGHT;
    var rightCheckY = playerY + playerSin() * PLAYER_WIDTH / 2 + playerCos() * -1 * PLAYER_ROTATE_CHECK_HEIGHT;
    // center
    var deg = 0;
    while (!isInWall(leftCheckX, leftCheckY) && !isInWall(rightCheckX, rightCheckY) && isInWall(playerX, playerY, PLAYER_WIDTH) && deg < 360) {
        playerRotation ++;
        leftCheckX = playerX + playerCos() * -1 * PLAYER_WIDTH / 2 + playerSin() * PLAYER_ROTATE_CHECK_HEIGHT;
        leftCheckY = playerY - playerSin() * PLAYER_WIDTH / 2 + playerCos() * -1 * PLAYER_ROTATE_CHECK_HEIGHT;
        rightCheckX = playerX - playerCos() * -1 * PLAYER_WIDTH / 2 + playerSin() * PLAYER_ROTATE_CHECK_HEIGHT;
        rightCheckY = playerY + playerSin() * PLAYER_WIDTH / 2 + playerCos() * -1 * PLAYER_ROTATE_CHECK_HEIGHT;
        deg ++;
    }
    // left
    while (isInWall(leftCheckX, leftCheckY) && isInWall(playerX, playerY, PLAYER_WIDTH)) {
        rotateAround(1, 1);
        leftCheckX = playerX + playerCos() * -1 * PLAYER_WIDTH / 2 + playerSin() * PLAYER_ROTATE_CHECK_HEIGHT;
        leftCheckY = playerY - playerSin() * PLAYER_WIDTH / 2 + playerCos() * -1 * PLAYER_ROTATE_CHECK_HEIGHT;
    }
    while (!isInWall(leftCheckX, leftCheckY) && isInWall(playerX, playerY, PLAYER_WIDTH)) {
        rotateAround(-1, 1);
        leftCheckX = playerX + playerCos() * -1 * PLAYER_WIDTH / 2 + playerSin() * PLAYER_ROTATE_CHECK_HEIGHT;
        leftCheckY = playerY - playerSin() * PLAYER_WIDTH / 2 + playerCos() * -1 * PLAYER_ROTATE_CHECK_HEIGHT;
    }
    // right
    while (isInWall(rightCheckX, rightCheckY) && isInWall(playerX, playerY, PLAYER_WIDTH))  {
        rotateAround(-1, 0);
        rightCheckX = playerX - playerCos() * -1 * PLAYER_WIDTH / 2 + playerSin() * PLAYER_ROTATE_CHECK_HEIGHT;
        rightCheckY = playerY + playerSin() * PLAYER_WIDTH / 2 + playerCos() * -1 * PLAYER_ROTATE_CHECK_HEIGHT;
    }
    while (!isInWall(rightCheckX, rightCheckY) && isInWall(playerX, playerY, PLAYER_WIDTH))  {
        rotateAround(1, 0);
        rightCheckX = playerX - playerCos() * -1 * PLAYER_WIDTH / 2 + playerSin() * PLAYER_ROTATE_CHECK_HEIGHT;
        rightCheckY = playerY + playerSin() * PLAYER_WIDTH / 2 + playerCos() * -1 * PLAYER_ROTATE_CHECK_HEIGHT;
    }
    //#endregion

    //#region FIREBASE
    if (connectedAccount != "" && life > 0) {
        sendFirebasePosition(connectedAccount, playerX, playerY, playerRotation);
        sendFirebaseBullets(connectedAccount, bullets);
    }

    // recuperer les joueurs
    var listRef = database.ref('players');
    listRef.get().then((snapshot) => {
    if (snapshot.exists()) {
        players = Object.values(snapshot.val());
        playerKeys = Object.keys(snapshot.val());
    }});

    var listRef = database.ref('players-bullets');
    listRef.get().then((snapshot) => {
    if (snapshot.exists()) {
        otherBullets = Object.values(snapshot.val());
    } else {
        otherBullets = [];
    }});
    //#endregion

    //#region BULLETS
    for (var i = 0; i < bullets.length; i++) {
        bullets[i][0] += Math.sin((bullets[i][2]) * (Math.PI/180)) * BULLET_SPEED;
        bullets[i][1] += Math.cos((bullets[i][2]) * (Math.PI/180)) * BULLET_SPEED;
        if (isInWall(bullets[i][0], bullets[i][1]) || bullets[i][0] < 0 || bullets[i][0] > mapWidth || bullets[i][1] < 0 || bullets[i][1] > mapHeight) {
            bullets.splice(i, 1);
        }
    }
    //#endregion

    //#region LIFE
    var listRef = database.ref('players/' + connectedAccount);
    listRef.get().then((snapshot) => {
        if (snapshot.exists() && snapshot.val().life != null) {
            life = BASE_LIFE - snapshot.val().life;
            killer = snapshot.val().killer;
        }
    });
    if (life <= 0) {
        document.getElementById("killedby").innerHTML = "Tué par: " + killer;
        OpenMenu("death");
        var listRef = database.ref('players' + connectedAccount);
        listRef.remove();
    }
    //#endregion

    //#region DRAW
    // calc offsets & mul
    var xMul = canvas.width / mapWidth;
    var yMul = canvas.height / mapHeight;
    var mul = yMul > xMul ? xMul : yMul;
    var yOff = (canvas.height - mapHeight * mul) / 2;
    var xOff = (canvas.width - mapWidth * mul) / 2;

    // walls
    for (var i = 0; i < walls.length; i++) {
        // background
        ctx.fillStyle = "#E2E289";
        ctx.fillRect(walls[i][0] * mul + xOff, walls[i][1] * mul + yOff, (walls[i][2] - walls[i][0]) * mul, (walls[i][3] - walls[i][1]) * mul);
    }

    // canon
    ctx.fillStyle = "blue";
    ctx.translate(playerX, playerY - PLAYER_HEIGHT / 2);
    ctx.rotate(canonRotation * (Math.PI/180));
    //ctx.fillRect(-CANON_WIDTH / 2, -CANON_SIZE / 2, CANON_WIDTH, CANON_SIZE);
    ctx.rotate(-canonRotation * (Math.PI/180));
    ctx.translate(-playerX, -(playerY - PLAYER_HEIGHT / 2));

    // bullets
    ctx.fillStyle = "green";
    if (otherBullets[0] != null) {
        for (var i = 0; i < otherBullets[0].length; i++) {
            ctx.fillRect((otherBullets[0][i][0] - 5) * mul + xOff, (otherBullets[0][i][1] - 5) * mul + yOff, 10 * mul, 10 * mul);
        }
    }

    // player
    ctx.translate(playerX * mul + xOff, playerY * mul + yOff);
    ctx.rotate(playerRotation * (Math.PI/180));
    ctx.fillStyle = "red"
    ctx.fillRect(-PLAYER_WIDTH * mul / 2, -PLAYER_HEIGHT * mul / 2, PLAYER_WIDTH * mul, PLAYER_HEIGHT * mul);
    ctx.fillStyle = "white"
    ctx.fillRect(-PLAYER_WIDTH * 0.4 * mul, -PLAYER_HEIGHT * 0.4 * mul, 10 * mul, 10 * mul);
    ctx.fillRect(PLAYER_WIDTH * 0.4 * mul - 10 * mul, -PLAYER_HEIGHT * 0.4 * mul, 10 * mul, 10 * mul);
    ctx.rotate(-playerRotation * (Math.PI/180));
    ctx.translate(-playerX * mul + xOff, -playerY * mul + yOff);

    // other players
    for (var i = 0; i < players.length; i ++) {
        if (playerKeys[i] != connectedAccount) {
            // hitted by my bullet
            var hitted = false;
            for (var k = 0; k < bullets.length; k++) {
                if (Math.abs(players[i].x - bullets[k][0]) <= PLAYER_WIDTH / 2 && Math.abs(players[i].y - bullets[k][1]) <= PLAYER_HEIGHT / 2) {
                    bullets.splice(k, 1);
                    hitPlayer(playerKeys[i], 1, connectedAccount);
                }
            }

            ctx.translate(players[i].x * mul - xOff, players[i].y * mul - yOff);
            ctx.rotate(players[i].r * (Math.PI/180));
            ctx.fillStyle = "blue";
            ctx.fillRect(-PLAYER_WIDTH * mul / 2, -PLAYER_HEIGHT * mul / 2, PLAYER_WIDTH * mul, PLAYER_HEIGHT * mul);
            ctx.fillStyle = "white";
            ctx.fillRect(-PLAYER_WIDTH * 0.4 * mul, -PLAYER_HEIGHT * 0.4 * mul, 10 * mul, 10 * mul);
            ctx.fillRect(PLAYER_WIDTH * 0.4 * mul - 10 * mul, -PLAYER_HEIGHT * 0.4 * mul, 10 * mul, 10 * mul);
            ctx.rotate(-players[i].r * (Math.PI/180));
            ctx.translate(-players[i].x * mul - xOff, -players[i].y * mul - yOff);

            // pseudo
            ctx.fillStyle = "black";
            ctx.font = "bold " + 20 * mul.toString() + "px Segoe UI";
            ctx.fillText(playerKeys[i], (players[i].x - playerKeys[i].length * 5) * mul + xOff, (players[i].y - PLAYER_HEIGHT) * mul + yOff);
        }
    }

    //#region UI
    // life
    ctx.strokeStyle = "black";
    ctx.fillStyle = "red";
    ctx.lineWidth = 5;
    ctx.strokeRect(20, canvas.height - 70, 200, 50);
    ctx.fillRect(25, canvas.height - 65, 190 * (life / BASE_LIFE), 40);
    //#endregion
    //#endregion

    //#region CANON
    canonRotation = (mouseY > (playerY * mul + yOff) ? 0 : 180) + Math.atan(((playerX * mul + xOff) - mouseX) / ((playerY * mul + yOff) - mouseY)) / (Math.PI/180);
    //#endregion

    playerRotation %= 360;
    if (playerX < 0 || playerX > mapWidth || playerY < 0 || playerY > mapHeight) {
        playerX = mapWidth / 2;
        playerY = mapHeight - PLAYER_HEIGHT / 2 - OUTSIDE_WALL_WIDTH;
        playerRotation = 0;
        playerVelocityX = 0;
        playerVelocityY = 0;
    }
    requestAnimationFrame(loop);
}

//position de la souris
canvas.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
canvas.addEventListener("mousedown", (e) => {
    if (e.which === 1) {
        shoot();
    }
});
document.addEventListener('keydown', function(e) {
    if (e.which === 65) {
        playerDirection = PLAYER_SPEED;
    }
    if (e.which === 68) {
        playerDirection = -PLAYER_SPEED;
    }
    if (e.which === 32 && isInWall(playerX, playerY, PLAYER_WIDTH)) {
        playerX += playerSin() * PLAYER_WIDTH * 1.5
        playerY -= playerCos() * PLAYER_WIDTH * 1.5;
        playerVelocityY = -playerCos() * JUMP_FORCE;
        playerVelocityX = playerSin() * JUMP_FORCE;
    }
});
document.addEventListener('keyup', function(e) {
    if (e.which === 65 || e.which === 68) {
        playerDirection = 0;
    }
});

window.addEventListener('beforeunload', function() {
    deletePlayers();
}, false);

// start game
requestAnimationFrame(loop);
