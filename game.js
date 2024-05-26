const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// DOM elements for game states
const startScreen = document.getElementById('startScreen');
const pauseScreen = document.getElementById('pauseScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const startButton = document.getElementById('startButton');
const resumeButton = document.getElementById('resumeButton');
const restartButton = document.getElementById('restartButton');

// Player's car object
let car = {
    width: 50,
    height: 100,
    x: canvas.width / 2 - 25,
    y: canvas.height - 120,
    speed: 5,
    image: new Image()
};

car.image.src = 'car.png'; // Player's car image

// Other cars array and road image
let otherCars = [];
let otherCarSpeed = 3;
let score = 0;
let gameOver = false;
let gamePaused = false;
let frameCount = 0;

const roadImage = new Image();
roadImage.src = 'road.jpg'; // Road image

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

let rightPressed = false;
let leftPressed = false;

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === 'p') {
        togglePause();
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function drawCar(car) {
    ctx.drawImage(car.image, car.x, car.y, car.width, car.height);
}

function drawOtherCars() {
    for (let car of otherCars) {
        ctx.drawImage(car.image, car.x, car.y, car.width, car.height);
    }
}

function updateOtherCars() {
    frameCount++;
    if (frameCount % 100 === 0) {
        let x = Math.random() * (canvas.width - 50);
        let newCar = {
            x: x,
            y: -100,
            width: 50,
            height: 100,
            image: new Image()
        };
        newCar.image.src = 'other_car.png';
        otherCars.push(newCar);
    }

    for (let i = 0; i < otherCars.length; i++) {
        otherCars[i].y += otherCarSpeed;
        if (otherCars[i].y > canvas.height) {
            otherCars.splice(i, 1);
            score += 10;
            otherCarSpeed += 0.1;
        }
    }
}

function checkCollision() {
    for (let otherCar of otherCars) {
        if (
            car.x < otherCar.x + otherCar.width &&
            car.x + car.width > otherCar.x &&
            car.y < otherCar.y + otherCar.height &&
            car.y + car.height > otherCar.y
        ) {
            gameOver = true;
        }
    }
}

function drawScore() {
    ctx.fillStyle = 'red';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 8, 20);
}

function drawRoad() {
    ctx.drawImage(roadImage, 0, 0, canvas.width, canvas.height);
}

function draw() {
    if (gameOver) {
        showGameOverScreen();
        return;
    }

    if (gamePaused) {
        showPauseScreen();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoad();
    drawCar(car);
    drawOtherCars();
    drawScore();

    updateOtherCars();
    checkCollision();

    if (rightPressed && car.x < canvas.width - car.width) {
        car.x += car.speed;
    } else if (leftPressed && car.x > 0) {
        car.x -= car.speed;
    }

    requestAnimationFrame(draw);
}

function startGame() {
    resetGame();
    startScreen.classList.add('hidden');
    canvas.classList.remove('hidden');
    draw();
}

function resetGame() {
    otherCars = [];
    otherCarSpeed = 3;
    score = 0;
    gameOver = false;
    frameCount = 0;
    car.x = canvas.width / 2 - 25;
    car.y = canvas.height - 120;
}

function togglePause() {
    gamePaused = !gamePaused;
    if (!gamePaused) {
        pauseScreen.classList.add('hidden');
        draw();
    }
}

function showPauseScreen() {
    pauseScreen.classList.remove('hidden');
}

function showGameOverScreen() {
    gameOverScreen.classList.remove('hidden');
    finalScore.innerText = 'Score: ' + score;
}

startButton.addEventListener('click', startGame);
resumeButton.addEventListener('click', togglePause);
restartButton.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    resetGame();
    draw();
});

car.image.onload = function() {
    startScreen.classList.remove('hidden');
};

roadImage.onload = function() {
    // Road image loaded
};

car.image.onerror = function() {
    console.error('Failed to load car image.');
};

roadImage.onerror = function() {
    console.error('Failed to load road image.');
};
