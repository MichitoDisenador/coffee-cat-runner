const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Función para ajustar tamaño del canvas
function resizeCanvas() {
    const container = canvas.parentElement;
    const maxWidth = Math.min(800, window.innerWidth - 40);
    canvas.style.width = `${maxWidth}px`;
    canvas.style.height = 'auto';
    
    // Mantener proporción 800:300
    const scale = maxWidth / 800;
    canvas.width = 800;
    canvas.height = 300;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const BG_COLOR = '#2c2e30';
const ACCENT_COLOR = '#ffd333';

let gameRunning = true;
let score = 0;
let highScore = localStorage.getItem('catHighScore') || 0;
document.getElementById('highScore').innerText = highScore;

// Gato (coordenadas fijas relativas al canvas 800x300)
const cat = {
    x: 70,
    y: 0,
    width: 38,
    height: 38,
    groundY: 258, // 300 - 42
    velocity: 0,
    gravity: 0.8,
    jumpPower: -11,
    isJumping: false
};
cat.y = cat.groundY;

// Taza
let obstacle = {
    x: canvas.width,
    y: 258,
    width: 30,
    height: 35,
    active: true
};

let frameCounter = 0;
let spawnGap = 85;

function drawCat() {
    ctx.save();
    
    // Cuerpo
    ctx.fillStyle = ACCENT_COLOR;
    ctx.beginPath();
    ctx.ellipse(cat.x + cat.width/2, cat.y + cat.height/2 - 3, cat.width/2.2, cat.height/2.2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Orejas
    ctx.beginPath();
    ctx.moveTo(cat.x + 6, cat.y + 2);
    ctx.lineTo(cat.x + 14, cat.y - 8);
    ctx.lineTo(cat.x + 22, cat.y + 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(cat.x + cat.width - 6, cat.y + 2);
    ctx.lineTo(cat.x + cat.width - 14, cat.y - 8);
    ctx.lineTo(cat.x + cat.width - 22, cat.y + 2);
    ctx.fill();
    
    // Ojos
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cat.x + 12, cat.y + 16, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cat.x + 26, cat.y + 16, 5.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupilas
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(cat.x + 11, cat.y + 15, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cat.x + 25, cat.y + 15, 2.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Gafas
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(cat.x + 12, cat.y + 16, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cat.x + 26, cat.y + 16, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cat.x + 19, cat.y + 15);
    ctx.lineTo(cat.x + 19, cat.y + 17);
    ctx.stroke();
    
    // Nariz y bigotes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(cat.x + 19, cat.y + 23, 2.2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(cat.x + 7, cat.y + 20);
    ctx.lineTo(cat.x + 13, cat.y + 22);
    ctx.moveTo(cat.x + 7, cat.y + 24);
    ctx.lineTo(cat.x + 13, cat.y + 24);
    ctx.moveTo(cat.x + 25, cat.y + 22);
    ctx.lineTo(cat.x + 31, cat.y + 20);
    ctx.moveTo(cat.x + 25, cat.y + 24);
    ctx.lineTo(cat.x + 31, cat.y + 24);
    ctx.stroke();
    
    ctx.restore();
}

function drawCoffee() {
    ctx.fillStyle = ACCENT_COLOR;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height - 8);
    
    ctx.beginPath();
    ctx.ellipse(obstacle.x + obstacle.width + 5, obstacle.y + 12, 6, 9, 0, 0, Math.PI * 2);
    ctx.strokeStyle = ACCENT_COLOR;
    ctx.lineWidth = 3.5;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(obstacle.x + 8, obstacle.y - 4);
    ctx.lineTo(obstacle.x + 12, obstacle.y - 12);
    ctx.lineTo(obstacle.x + 16, obstacle.y - 4);
    ctx.fill();
}

function drawLogo() {
    ctx.font = 'bold 20px "Montserrat"';
    ctx.fillStyle = ACCENT_COLOR;
    ctx.fillText("🐱", 12, 38);
    ctx.font = 'bold 11px "Montserrat"';
    ctx.fillStyle = "#ffd333cc";
    ctx.fillText("Michito", 38, 35);
}

function updateCat() {
    cat.velocity += cat.gravity;
    cat.y += cat.velocity;
    
    if (cat.y >= cat.groundY) {
        cat.y = cat.groundY;
        cat.isJumping = false;
        cat.velocity = 0;
    }
    
    if (cat.y < 0) {
        cat.y = 0;
        if (cat.velocity < 0) cat.velocity = 0;
    }
}

function jump() {
    if (!gameRunning) {
        resetGame();
        return;
    }
    
    if (!cat.isJumping) {
        cat.velocity = cat.jumpPower;
        cat.isJumping = true;
    }
}

function updateObstacle() {
    if (!obstacle.active) return;
    
    obstacle.x -= 5;
    
    if (obstacle.x + obstacle.width < 0) {
        obstacle.active = false;
        score++;
        document.getElementById('score').innerText = score;
        
        if (score > 10) spawnGap = 70;
        if (score > 20) spawnGap = 60;
        if (score > 35) spawnGap = 50;
    }
    
    if (obstacle.active &&
        cat.x < obstacle.x + obstacle.width - 4 &&
        cat.x + cat.width - 4 > obstacle.x &&
        cat.y + cat.height - 6 > obstacle.y &&
        cat.y + 12 < obstacle.y + obstacle.height) {
        gameRunning = false;
    }
}

function spawnObstacle() {
    if (!obstacle.active && gameRunning) {
        obstacle = {
            x: canvas.width,
            y: 258,
            width: 30,
            height: 35,
            active: true
        };
        frameCounter = 0;
    }
}

function resetGame() {
    gameRunning = true;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('catHighScore', highScore);
        document.getElementById('highScore').innerText = highScore;
    }
    score = 0;
    document.getElementById('score').innerText = score;
    
    cat.y = cat.groundY;
    cat.velocity = 0;
    cat.isJumping = false;
    obstacle.active = false;
    frameCounter = spawnGap;
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Suelo
    ctx.fillStyle = ACCENT_COLOR;
    ctx.fillRect(0, canvas.height - 42, canvas.width, 3);
    
    if (gameRunning) {
        updateCat();
        updateObstacle();
        
        frameCounter++;
        if (frameCounter >= spawnGap && !obstacle.active) {
            spawnObstacle();
            frameCounter = 0;
        }
    } else {
        ctx.fillStyle = ACCENT_COLOR;
        ctx.font = 'bold 24px "Montserrat"';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 30);
        ctx.font = '12px "Montserrat"';
        ctx.fillStyle = '#ffd333cc';
        ctx.fillText('Tap / Espacio para reiniciar', canvas.width/2, canvas.height/2 + 20);
        ctx.textAlign = 'left';
    }
    
    drawCat();
    if (obstacle.active) drawCoffee();
    drawLogo();
    
    requestAnimationFrame(animate);
}

// Eventos
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
    }
});
canvas.addEventListener('click', (e) => {
    e.preventDefault();
    jump();
});
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
});

document.getElementById('highScore').innerText = highScore;
setTimeout(() => {
    if (!obstacle.active && gameRunning) {
        frameCounter = 40;
    }
}, 500);

animate();
