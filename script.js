const box = document.getElementById("box");
const scoreDisplay = document.getElementById("score");

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let missedClicks = 0;
let gameActive = true;
let timeLeft = 30;
let timer;
let boxInterval;

const highScoreDisplay = document.createElement('h3');
highScoreDisplay.innerHTML = `High Score: <span id="highScore">${highScore}</span>`;
document.body.insertBefore(highScoreDisplay, document.getElementById('gameArea'));

const timerDisplay = document.createElement('h3');
timerDisplay.innerHTML = 'Time: <span id="timer">30</span>s';
document.body.insertBefore(timerDisplay, document.getElementById('gameArea'));

const messageDisplay = document.createElement('div');
messageDisplay.id = 'message';
document.body.appendChild(messageDisplay);

function startGame() {
    gameActive = true;
    score = 0;
    timeLeft = 30;
    missedClicks = 0;
    updateScore();
    updateTimer();
    moveBox();
    box.style.display = 'block';
    
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(timer);
    clearInterval(boxInterval);
    box.style.display = 'none';
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').textContent = highScore;
        showMessage('New High Score!');
    } else {
        showMessage(`Game Over! Score: ${score}`);
    }
    
    setTimeout(() => {
        if (confirm('Play again?')) {
            resetGame();
        }
    }, 100);
}

function resetGame() {
    box.style.display = 'block';
    score = 0;
    missedClicks = 0;
    startGame();
    updateScore();
}

function updateTimer() {
    document.getElementById('timer').textContent = timeLeft;
}

function showMessage(msg) {
    messageDisplay.textContent = msg;
    messageDisplay.style.display = 'block';
    setTimeout(() => {
        messageDisplay.style.display = 'none';
    }, 2000);
}

function moveBox() {
    if (!gameActive) return;
    
    const gameArea = document.getElementById("gameArea");
    const boxSize = 60;
    
    const maxX = gameArea.clientWidth - boxSize;
    const maxY = gameArea.clientHeight - boxSize;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    box.style.left = randomX + "px";
    box.style.top = randomY + "px";
    
    const hue = Math.random() * 360;
    box.style.background = `linear-gradient(135deg, hsl(${hue}, 100%, 70%), hsl(${hue}, 100%, 50%))`;
}

box.addEventListener("click", function(e) {
    e.stopPropagation();
    if (!gameActive) return;
    
    score++;
    updateScore();
    moveBox();
    
    this.style.transform = 'scale(0.8)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 200);
});

document.getElementById('gameArea').addEventListener('click', function(e) {
    if (!gameActive || e.target === box) return;
    
    missedClicks++;
    if (missedClicks >= 5) {
        timeLeft = Math.max(0, timeLeft - 2);
        missedClicks = 0;
    }
});

function updateScore() {
    scoreDisplay.textContent = score;
}

const difficultySelect = document.createElement('select');
difficultySelect.innerHTML = `
    <option value="easy">Easy</option>
    <option value="medium" selected>Medium</option>
    <option value="hard">Hard</option>
`;
difficultySelect.style.margin = '10px';
document.body.insertBefore(difficultySelect, document.getElementById('gameArea'));

difficultySelect.addEventListener('change', function() {
    if (!gameActive) return;
    
    clearInterval(boxInterval);
    const speed = {
        easy: 1500,
        medium: 1000,
        hard: 500
    }[this.value];
    
    boxInterval = setInterval(() => {
        if (gameActive) moveBox();
    }, speed);
});

boxInterval = setInterval(() => {
    if (gameActive) moveBox();
}, 1000);

startGame();