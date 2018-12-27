// Canvas object
var canvas;
var ctx;
var cw = 450;
var ch = 450;

//snake
var snakeSize = 10;
var snakeHeadPositionX = 50;
var snakeHeadPositionY = 50;
var snakeBody = [
[snakeHeadPositionX, snakeHeadPositionY],
[snakeHeadPositionX, snakeHeadPositionY-snakeSize],
[snakeHeadPositionX, snakeHeadPositionY-snakeSize]
];
var snakeSpeed = 60;

//snake directions
var snakeDirections = Object.freeze({"left":1, "up":2, "down":3, "right":4});
var snakeCurrentDirection = snakeDirections.down;

//game controll flags
var isGameRunning = false;

//apple
var appleSize = 10;
var applePosX;
var applePosY;

function snakeGame(canvasId) {
  canvas = document.getElementById(canvasId);
  ctx = canvas.getContext('2d');
  canvas.width = cw;
  canvas.height = ch;
  window.addEventListener('keydown', moveKeyPressed);
}

function startGame() {
  drawSnake();
  drawApple();
  setInterval(function(){
    switch(snakeCurrentDirection) {
      case snakeDirections.left:
        moveSnakeHeadLeft();
        break;
      case snakeDirections.up:
        moveSnakeHeadUp();
        break;
      case snakeDirections.right:
        moveSnakeHeadRight();
        break;
      case snakeDirections.down:
        moveSnakeHeadDown();
        break;
    }
  },10000/snakeSpeed);

  isGameRunning = true;
}

function moveKeyPressed(e) {
  if(isGameRunning) {
    switch(e.keyCode)
    {
      // left
      case 37:
        // action when pressing left key
        if(snakeCurrentDirection !== snakeDirections.left && snakeCurrentDirection !== snakeDirections.right) {
          moveSnakeHeadLeft();
        }
        break;
        // up
        case 38:
        // action when pressing up key
        if(snakeCurrentDirection !== snakeDirections.up && snakeCurrentDirection !== snakeDirections.down) {
          moveSnakeHeadUp();
        }
        break;
      // right
      case 39:
        // action when pressing right key
        if(snakeCurrentDirection !== snakeDirections.right && snakeCurrentDirection !== snakeDirections.left) {
          moveSnakeHeadRight();
        }
        break;
      // down
      case 40:
        // action when pressing down key
        if(snakeCurrentDirection !== snakeDirections.down && snakeCurrentDirection !== snakeDirections.up) {
          moveSnakeHeadDown();
        }
        break;
      default:
        break;
    }
  }  else {
    startGame();
  }
}

function moveSnakeHeadLeft() {
  if(snakeHeadPositionX === 0) {
    snakeHeadPositionX = cw-snakeSize;
  } else {
      snakeHeadPositionX -= snakeSize;
  }
  snakeCurrentDirection = snakeDirections.left;
  updateSnakePosition();
}


function moveSnakeHeadUp() {
  if(snakeHeadPositionY === 0)
  {
    snakeHeadPositionY = ch-snakeSize;
  } else {
    snakeHeadPositionY -= snakeSize;
  }
  snakeCurrentDirection = snakeDirections.up;
  updateSnakePosition();
}

function moveSnakeHeadRight() {
  if(snakeHeadPositionX === cw-snakeSize) {
    snakeHeadPositionX = 0;
  } else {
      snakeHeadPositionX += snakeSize;
  }
  snakeCurrentDirection = snakeDirections.right;
  updateSnakePosition();
}

function moveSnakeHeadDown() {
  if(snakeHeadPositionY === ch-snakeSize)
  {
    snakeHeadPositionY = 0;
  } else {
    snakeHeadPositionY += snakeSize;
  }
  snakeCurrentDirection = snakeDirections.down;
  updateSnakePosition();
}

function updateSnakePosition() {
  if(isAppleEaten()) {
    snakeBody.unshift([applePosX, applePosY])
    drawApple();
  }
  snakeBody.unshift([snakeHeadPositionX, snakeHeadPositionY]);
  var tailToRemove = snakeBody.pop();
  drawSnake();
  ctx.clearRect(tailToRemove[0], tailToRemove[1], snakeSize, snakeSize);
}

function drawSnake() {
  snakeBody.forEach(function(pos)
  {
    ctx.fillRect(pos[0],pos[1], snakeSize, snakeSize);
  });
}

function drawApple() {
  applePosX = Math.floor(Math.random()*44)*10;
  applePosY = Math.floor(Math.random()*44)*10;

  ctx.fillRect(applePosX, applePosY, appleSize, appleSize);
}

function isAppleEaten() {
  if(snakeHeadPositionX === applePosX && snakeHeadPositionY === applePosY) {
    return true;
  }
  return false;
}

function addEatenAppleToSnake() {
  var snakeHead = snakeBody.shift();
  snakeBody.unshift([applePosX, applePosY]);
  snakeBody.unshift(snakeHead);
  ctx.clearRect(applePosX, applePosY, appleSize, appleSize);
}
