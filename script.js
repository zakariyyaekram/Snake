document.addEventListener("keydown", keyHandler, false);
const canvas = document.getElementById("game-area");
const statusDiv = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const highScoreDiv = document.getElementById("highScoreDiv");
const scoreDiv = document.getElementById("scoreDiv");
const context = canvas.getContext("2d");
const gridSize = 40;
const blockWidth = canvas.width / gridSize;
const blockHeight = canvas.height / gridSize;
const snakeStartLength = 5;

let food = {};
let snake = [];
let direction = "right";
let highScore = 0;
let score = 0;
let storedHighScore = window.localStorage.getItem('snakeHighScore');

if(storedHighScore != null) {
  highScore = storedHighScore;
  highScoreDiv.innerHTML = `HighScore: ${highScore}`;
}

function keyHandler(e) {
  if (e.key === "ArrowRight" && direction !== "left") {
    direction = "right";
  } else if (e.key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  } else if (e.key === "ArrowDown" && direction !== "up") {
    direction = "down";
  } else if (e.key === "ArrowUp" && direction !== "down") {
    direction = "up";
  }
}

function start() {
  startBtn.disabled = true;
  status.innerHTML = " ";
  score = 0;
  scoreDiv.innerHTML = "Score: " + score;
  context.clearRect(0, 0, canvas.width, canvas.height);
  // creating a snake block:
  snake.length = 0;
  for (let i = 0; i < snakeStartLength; i++) {
    snake.push({ x: 10 - i, y: 1 });
  }
  direction = "right";
  createFood();

  drawSnake();
  drawFood();

  setTimeout(tick, 100);
}

function drawBlock(block, color) {
  // block has an x and y coordinate
  context.fillStyle = color;
  context.fillRect(block.x * 10, block.y * 10, 10, 10);
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    drawBlock(snake[i], "hsl(" + i*10 + "deg 100% 50%)");
  }
}

function createFood() {
  food.x = Math.floor(Math.random() * 40);
  food.y = Math.floor(Math.random() * 40);
}
function drawFood() {
  drawBlock(food, "green");
}

function moveSnake() {
  let newHead = {};
  if (direction === "right") {
    newHead = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "left") {
    newHead = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction === "down") {
    newHead = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "up") {
    newHead = { x: snake[0].x, y: snake[0].y - 1 };
  }

  snake.unshift(newHead);
  if (newHead.x === food.x && newHead.y === food.y) {
    createFood();
    score++;
    scoreDiv.innerHTML = "Score: " + score;
    if (score > highScore) {
      highScore = score;
      highScoreDiv.innerHTML = "Highscore: " + highScore;
      window.localStorage.setItem('snakeHighScore', highScore)
    }
  } else {
    snake.pop();
  }
}

// main game loop, called every 100 milliseconds
function tick() {
  moveSnake();

  let collision = checkCollision();
  if (collision) {
    statusDiv.innerHTML = "Game over";
    startBtn.disabled = false;
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    setTimeout(tick, 100);
  }
}

function checkCollision() {
  let head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      return true;
    }
  }
  if (
    snake[0].x === -1 ||
    snake[0].x === 40 ||
    snake[0].y === -1 ||
    snake[0].y === 40
  ) {
    return true;
  }
  return false;
}