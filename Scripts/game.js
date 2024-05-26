const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Player's car object
let car = {
    width: 50,
    height: 100,
    x: canvas.width / 2 - 25,
    y: canvas.height - 120,
    speed: 5,
    image: new Image()
};

car.image.src = '../Assets/Images/players_car.png'; // Player's car

// CPU cars - "opponent/game" array and road image
let cpuCars = [];
let cpuCarSpeed = 0;
let cpuCarSpeedIncrease = 0;
let score = 0;
let gameOver = false;
let gamePaused = false;
let frameCount = 0;
let difficulty = "";
let difficultyCar = 0;

const roadImage = new Image();
roadImage.src = '../Assets/Images/road.jpg'; // Road image

let roadOffset = 0;

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
    context.drawImage(car.image, car.x, car.y, car.width, car.height);
}

function drawCpuCars() {
    for (let car of cpuCars) {
        context.drawImage(car.image, car.x, car.y, car.width, car.height);
    }
}

function updateCpuCars() {
    frameCount++;
    if (frameCount % difficultyCar === 0) { // Add a new car every 100 frames
        let x = Math.random() * (canvas.width - 50);
        let newCar = {
            x: x,
            y: -100,
            width: 50,
            height: 100,
            image: new Image()
        };
        newCar.image.src = '../Assets/Images/cpu_car.png';
        cpuCars.push(newCar);
    }

    for (let i = 0; i < cpuCars.length; i++) {
        cpuCars[i].y += cpuCarSpeed;
        if (cpuCars[i].y > canvas.height) {
            cpuCars.splice(i, 1);
            score += 10;
            cpuCarSpeed += cpuCarSpeedIncrease;
        }
    }
}

function checkCollision() {
    for (let cpuCar of cpuCars) {
        if (
            car.x < cpuCar.x + cpuCar.width &&
            car.x + car.width > cpuCar.x &&
            car.y < cpuCar.y + cpuCar.height &&
            car.y + car.height > cpuCar.y
        ) {
            gameOver = true;
        }
    }
}

function drawScore() {
    context.fillStyle = 'red';
    context.font = '16px Arial';
    context.fillText('Score: ' + score, 8, 20);
}

function drawRoad() {
    roadOffset += cpuCarSpeed;
    if (roadOffset > canvas.height) {
        roadOffset = 0;
    }

    context.drawImage(roadImage, 0, roadOffset - canvas.height, canvas.width, canvas.height);
    context.drawImage(roadImage, 0, roadOffset, canvas.width, canvas.height);
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

    if (!difficulty) {
        showDifficultyScreen();
        return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawRoad();
    drawCar(car);
    drawCpuCars();
    drawScore();

    updateCpuCars();
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
    startScreen.classList.add('hidden'); // Hide starting screen
    difficultyScreen.classList.add('hidden'); // Hide difficulty screen if visible
    canvas.classList.remove('hidden');
    draw();
}

function resetGame() {
    cpuCars = [];
    score = 0;
    gameOver = false;
    gamePaused = false;
    frameCount = 0;
    roadOffset = 0;
    car.x = canvas.width / 2 - 25;
    car.y = canvas.height - 120;

    // Set (cpuCarSpeed, difficultyCar - how many of them show up, cpuCarSpeedIncrease - how quickly game speeds up) based on difficulty
    if (difficulty === "easy") {
        cpuCarSpeed = 5;
        difficultyCar = 120;
        cpuCarSpeedIncrease = 0.1;
    } else if (difficulty === "medium") {
        cpuCarSpeed = 6;
        difficultyCar = 100;
        cpuCarSpeedIncrease = 0.2;
    } else if (difficulty === "hard") {
        cpuCarSpeed = 7;
        difficultyCar = 80;
        cpuCarSpeedIncrease = 0.3;
    }
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

function showDifficultyScreen() {
    difficultyScreen.classList.remove('hidden');
}

function showGameOverScreen() {
    gameOverScreen.classList.remove('hidden');
    finalScore.innerText = 'Score: ' + score;
}

// Add event listeners to difficulty buttons
easyButton.addEventListener('click', () => {
    difficulty = "easy";
    startGame();
});

mediumButton.addEventListener('click', () => {
    difficulty = "medium";
    startGame();
});

hardButton.addEventListener('click', () => {
    difficulty = "hard";
    startGame();
});

startButton.addEventListener('click', startGame);
resumeButton.addEventListener('click', togglePause);
restartButton.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    resetGame();
    draw();
});
exitButton.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    startScreen.classList.remove('hidden'); // Show starting screen
    resetGame();
});

car.image.onload = function() {
    startScreen.classList.remove('hidden');
};

car.image.onerror = function() {
    console.error('Failed to load car image.');
};

roadImage.onerror = function() {
    console.error('Failed to load road image.');
};
