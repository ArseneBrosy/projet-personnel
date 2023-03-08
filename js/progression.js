var canvas = document.getElementById("progression-canvas");
var ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 600;

ctx.strokeStyle = "#F77F00";
ctx.lineWidth = 10;

var mouseX = 0;
var points = [];
for (var i = 0; i < 100; i++) {
    points.push(parseInt(Math.random() * 200) + 200);
}
var currentValue = points[0];

var calculate = true;

function prog_loop() {
    if (calculate) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // path
        ctx.fillStyle = "#ffc383"
        ctx.moveTo(0, points[0]);
        ctx.beginPath();
        for (var i = 0; i < points.length; i++) {
            ctx.lineTo(i * (canvas.width / (points.length - 1)), canvas.height - points[i]);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        // current value
        ctx.fillStyle = "#f77f00";
        for (var i = 0; i < points.length; i++) {
            if (Math.abs(mouseX - (i * (canvas.width / (points.length - 1)))) <= (canvas.width / (points.length - 1)) / 2) {
                // line
                ctx.fillRect(i * (canvas.width / (points.length - 1)) - 2, 0, 4, canvas.height);
                // dot
                ctx.beginPath();
                ctx.arc(i * (canvas.width / (points.length - 1)), canvas.height - points[i] - 5, 10, 0, 2 * Math.PI);
                ctx.fill();
                // var
                currentValue = points[i];
            }
        }
        document.getElementById("current-value").innerHTML = currentValue;
    }
    requestAnimationFrame(prog_loop);
}

document.addEventListener("mousemove", (e) => {
    mouseX = (e.x - canvas.offsetLeft) * (canvas.width / canvas.clientWidth);

    calculate = e.x >= canvas.offsetLeft && e.x <= canvas.offsetLeft + canvas.clientWidth &&
    e.y >= canvas.offsetTop && e.y <= canvas.offsetTop + canvas.clientHeight;
});

requestAnimationFrame(prog_loop);