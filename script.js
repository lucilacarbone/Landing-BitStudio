const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d");

// Función para redimensionar el canvas responsivamente
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = 400;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let t = 0;
const shapes = [];

function randomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 60%)`;
}

function createShapes(count) {
    for (let i = 0; i < count; i++) {
        shapes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 10 + Math.random() * 30,
            speed: 0.5 + Math.random(),
            angle: Math.random() * 2 * Math.PI,
            type: ["circle", "square", "star"][Math.floor(Math.random() * 3)],
            color: randomColor(),
            baseOpacity: 0.5 + Math.random() * 0.5,
            rotation: Math.random() * 2 * Math.PI
        });
    }
}

function drawWaveBackground() {
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
        const y = 50 * Math.sin((x + t * 100) * 0.01) + canvas.height / 2;
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(0,255,180,0.2)";
    ctx.stroke();
}

function drawStar(x, y, r, n, inset, color) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(0, -r);
    for (let i = 0; i < n; i++) {
        ctx.rotate(Math.PI / n);
        ctx.lineTo(0, -r * inset);
        ctx.rotate(Math.PI / n);
        ctx.lineTo(0, -r);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWaveBackground();

    for (let shape of shapes) {
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        ctx.globalAlpha = shape.baseOpacity + 0.1 * Math.sin(t * 5 + shape.size); // efecto de parpadeo sutil
        ctx.fillStyle = shape.color;

        switch (shape.type) {
            case "circle":
                ctx.beginPath();
                ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
                ctx.fill();
                break;
            case "square":
                ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
                break;
            case "star":
                drawStar(0, 0, shape.size / 2, 5, 0.5, shape.color);
                break;
        }

        ctx.restore();

        // Movimiento
        shape.x += Math.cos(shape.angle) * shape.speed;
        shape.y += Math.sin(shape.angle) * shape.speed;
        shape.rotation += 0.002;

        // Reciclado si sale del canvas
        if (
            shape.x < -50 || shape.x > canvas.width + 50 ||
            shape.y < -50 || shape.y > canvas.height + 50
        ) {
            shape.x = Math.random() * canvas.width;
            shape.y = -60;
        }
    }

    t += 0.01;
    requestAnimationFrame(draw);
}

// Inicialización
createShapes(40);
draw();
