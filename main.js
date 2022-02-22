let gameOver = false;
let gridSize = 21;
let newSegment = 0;
let EXP = 3;
let inputDirection = {x: 0, y: 0};
let gameBoard = document.querySelector("#game-board");
let lastRenderTiem = 0;
let snakeSpeed = 5;
const snakeBody = [{x: 11, y: 11}];
function main(currentTime) {
    if (gameOver) {
        if (confirm("You lost. Press ok to restart")) window.location = "";
        return;
    }
    window.requestAnimationFrame(main);
    const secondsSinceLastRender = (currentTime - lastRenderTiem) / 1000;
    if (secondsSinceLastRender < 1 / snakeSpeed) return;
    lastRenderTiem = currentTime;

    update();
    draw();
}
window.requestAnimationFrame(main);

function update() {
    addSegments();
    const inputDir = gitInputDirection();
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = {...snakeBody[i]};
    }
    snakeBody[0].x += inputDir.x;
    snakeBody[0].y += inputDir.y;
    updateFood();
    checkDeath();
    gameLvl();
}
function draw() {
    gameBoard.innerHTML = "";
    let flag = true;
    snakeBody.forEach((segment) => {
        const snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add("snake");
        if (flag) {
            snakeElement.classList.add("head");
            flag = false;
        }
        gameBoard.appendChild(snakeElement);
    });
    drawFood();
}

function gitInputDirection() {
    lastInputDirection = inputDirection;
    return inputDirection;
}
let lastInputDirection = {x: 0, y: 0};
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp": {
            if (lastInputDirection.y !== 0) break;
            inputDirection = {x: 0, y: -1};
            break;
        }
        case "ArrowDown": {
            if (lastInputDirection.y !== 0) break;
            inputDirection = {x: 0, y: 1};
            break;
        }
        case "ArrowLeft": {
            if (lastInputDirection.x !== 0) break;
            inputDirection = {x: -1, y: 0};
            break;
        }
        case "ArrowRight": {
            if (lastInputDirection.x !== 0) break;
            inputDirection = {x: 1, y: 0};
            break;
        }
    }
});

function drawFood() {
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    gameBoard.appendChild(foodElement);
}
function updateFood() {
    if (onSnake(food)) {
        expandSnake(EXP);
        food = getRandomFoodPosition();
    }
}
let score = document.querySelector(".score");
let currentScore = 0;
function expandSnake(amount) {
    newSegment += amount;
    currentScore += newSegment;
    score.innerHTML = currentScore;
}
function onSnake(position, {ignoreHead = false} = {}) {
    return snakeBody.some((segment, index) => {
        if (ignoreHead && index === 0) return false;
        return equalPos(segment, position);
    });
}
function equalPos(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}
function addSegments() {
    for (let i = 0; i < newSegment; i++) {
        snakeBody.push({...snakeBody[snakeBody.length - 1]});
    }
    newSegment = 0;
}
function getRandomFoodPosition() {
    let newFoodPosition;
    while (newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = randomGridPosition();
    }
    return newFoodPosition;
}
function randomGridPosition() {
    return {
        x: Math.floor(Math.random() * gridSize + 1),
        y: Math.floor(Math.random() * gridSize + 1),
    };
}

let food = getRandomFoodPosition();
function checkDeath() {
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}
function outsideGrid(position) {
    return (
        position.x < 1 ||
        position.x > gridSize ||
        position.y < 1 ||
        position.y > gridSize
    );
}
function getSnakeHead() {
    return snakeBody[0];
}
function snakeIntersection() {
    return onSnake(snakeBody[0], {ignoreHead: true});
}
function gameLvl() {
    if (snakeBody.length <= 20) {
        EXP = 3;
        snakeSpeed = 5;
    } else if (snakeBody.length <= 40) {
        EXP = 2;
        snakeSpeed = 7;
    } else {
        EXP = 1;
        snakeSpeed = 10;
    }
}
