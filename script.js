* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
}

body {
    background: #2c2e30;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Montserrat', 'Courier New', monospace;
}

.game-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: #2c2e30;
}

canvas {
    background: #2c2e30;
    border-radius: 0;
    box-shadow: none;
    cursor: pointer;
    display: block;
}

.score-board {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 800px;
    padding: 10px 20px;
    background: #2c2e30;
    color: #ffd333;
    font-weight: 800;
    font-size: 1.2rem;
    letter-spacing: 1px;
    font-family: 'Montserrat', monospace;
}

.controls-info {
    color: #ffd333;
    opacity: 0.6;
    font-size: 0.7rem;
    text-align: center;
    font-family: 'Montserrat', monospace;
    font-weight: 600;
}

.social-footer {
    display: flex;
    gap: 35px;
    justify-content: center;
    padding: 12px 25px;
    background: #2c2e30;
    margin-top: 10px;
}

.social-footer a {
    display: inline-block;
    transition: transform 0.2s ease;
    color: #ffd333;
    font-size: 32px;
}

.social-footer a:hover {
    transform: scale(1.15);
    color: white;
}

@media (max-width: 850px) {
    canvas {
        width: 100vw;
        height: auto;
    }
    
    .score-board {
        font-size: 0.9rem;
        padding: 6px 15px;
    }
    
    .social-footer a {
        font-size: 28px;
    }
}* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
}

body {
    background: #2c2e30;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Montserrat', 'Courier New', monospace;
}

.game-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: #2c2e30;
}

canvas {
    background: #2c2e30;
    border-radius: 0;
    box-shadow: none;
    cursor: pointer;
    display: block;
}

.score-board {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 800px;
    padding: 10px 20px;
    background: #2c2e30;
    color: #ffd333;
    font-weight: 800;
    font-size: 1.2rem;
    letter-spacing: 1px;
    font-family: 'Montserrat', monospace;
}

.controls-info {
    color: #ffd333;
    opacity: 0.6;
    font-size: 0.7rem;
    text-align: center;
    font-family: 'Montserrat', monospace;
    font-weight: 600;
}

.social-footer {
    display: flex;
    gap: 35px;
    justify-content: center;
    padding: 12px 25px;
    background: #2c2e30;
    margin-top: 10px;
}

.social-footer a {
    display: inline-block;
    transition: transform 0.2s ease;
    color: #ffd333;
    font-size: 32px;
}

.social-footer a:hover {
    transform: scale(1.15);
    color: white;
}

@media (max-width: 850px) {
    canvas {
        width: 100vw;
        height: auto;
    }
    
    .score-board {
        font-size: 0.9rem;
        padding: 6px 15px;
    }
    
    .social-footer a {
        font-size: 28px;
    }
        }    ctx.arc(cat.x + 16, cat.y + 20, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Dibujar taza de café
function drawCoffee() {
    ctx.fillStyle = ACCENT_COLOR;
    // Cuerpo de la taza
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height - 8);
    // Asa
    ctx.beginPath();
    ctx.ellipse(obstacle.x + obstacle.width + 4, obstacle.y + 12, 6, 8, 0, 0, Math.PI * 2);
    ctx.strokeStyle = ACCENT_COLOR;
    ctx.lineWidth = 3;
    ctx.stroke();
    // Vapor
    ctx.beginPath();
    ctx.moveTo(obstacle.x + 8, obstacle.y - 5);
    ctx.lineTo(obstacle.x + 12, obstacle.y - 12);
    ctx.lineTo(obstacle.x + 16, obstacle.y - 5);
    ctx.fill();
}

// Actualizar física del gato
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

// Saltar
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

// Actualizar obstáculo y colisiones
function updateObstacle() {
    if (!obstacle.active) return;
    
    obstacle.x -= 5;
    
    // Si sale de la pantalla, desactivar y sumar punto
    if (obstacle.x + obstacle.width < 0) {
        obstacle.active = false;
        score++;
        document.getElementById('score').innerText = score;
        
        // Aumentar dificultad gradualmente
        if (score > 10) spawnGap = 70;
        if (score > 20) spawnGap = 55;
        if (score > 35) spawnGap = 45;
    }
    
    // Colisión (con márgenes más realistas)
    if (obstacle.active &&
        cat.x < obstacle.x + obstacle.width - 5 &&
        cat.x + cat.width - 5 > obstacle.x &&
        cat.y + cat.height - 5 > obstacle.y &&
        cat.y + 10 < obstacle.y + obstacle.height) {
        gameRunning = false;
    }
}

// Generar nuevo obstáculo
function spawnObstacle() {
    if (!obstacle.active && gameRunning) {
        obstacle = {
            x: canvas.width,
            y: canvas.height - 35,
            width: 28,
            height: 32,
            active: true
        };
        frameCounter = 0;
    }
}

// Reiniciar juego
function resetGame() {
    gameRunning = true;
    score = 0;
    document.getElementById('score').innerText = score;
    
    // Actualizar récord
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('catHighScore', highScore);
        document.getElementById('highScore').innerText = highScore;
    }
    
    cat.y = cat.groundY;
    cat.velocity = 0;
    cat.isJumping = false;
    
    obstacle.active = false;
    frameCounter = spawnGap;
}

// Bucle principal de animación
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fondo (ya es color sólido por el canvas)
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Línea de suelo decorativa
    ctx.fillStyle = ACCENT_COLOR;
    ctx.fillRect(0, canvas.height - 35, canvas.width, 3);
    
    if (gameRunning) {
        updateCat();
        updateObstacle();
        
        // Control de spawn
        frameCounter++;
        if (frameCounter >= spawnGap && !obstacle.active) {
            spawnObstacle();
            frameCounter = 0;
        }
    } else {
        // Mensaje de Game Over
        ctx.fillStyle = ACCENT_COLOR;
        ctx.font = 'bold 24px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('☕ GAME OVER ☕', canvas.width/2, canvas.height/2 - 30);
        ctx.font = '16px monospace';
        ctx.fillStyle = '#ffd333cc';
        ctx.fillText('Click / Espacio / Tap para reiniciar', canvas.width/2, canvas.height/2 + 20);
        ctx.textAlign = 'left';
    }
    
    drawCat();
    if (obstacle.active) drawCoffee();
    
    requestAnimationFrame(animate);
}

// Eventos de control
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

// Mostrar récord al inicio
document.getElementById('highScore').innerText = highScore;

// Iniciar primer obstáculo después de unos frames
setTimeout(() => {
    if (!obstacle.active && gameRunning) {
        frameCounter = 40;
    }
}, 500);

// Arrancar juego
animate();
