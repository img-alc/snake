// Canvas Object
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
var gameRefreshInterval;
//apple
var appleSize = 10;
var applePosX;
var applePosY;
var possibleApplePosX;
var possibleApplePosY;

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

  gameRefreshInterval = setInterval(function(){
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
    snakeBody.unshift([applePosX, applePosY]);
    drawApple();
  } else {
    if(checkCollision()) {
      endGame();
    }
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
  generateApplePosition();
  ctx.fillRect(applePosX, applePosY, appleSize, appleSize);
}


function generateApplePosition() {
  possibleApplePosX = Math.floor(Math.random()*(cw/appleSize)-1)*appleSize;
  possibleApplePosY = Math.floor(Math.random()*(ch/appleSize)-1)*appleSize;
  if(snakeBody.forEach(function(pos){
    if(pos[0] === possibleApplePosX && pos[1] === possibleApplePosY) {
      return true;
    }
    return false;
  })) {
    generateApplePosition();
  } else {
    applePosX = possibleApplePosX;
    applePosY = possibleApplePosY;
  }
}

function isAppleEaten() {
  if(snakeHeadPositionX === applePosX && snakeHeadPositionY === applePosY) {
    return true;
  }
  return false;
}

function addEatenAppleToSnake() {
  var snakeBodyHeadX = snakeBody[0][0];
  var snakeBodyHeadY = snakeBody[0][1];
  snakeBody[0][0] = applePosX;
  snakeBody[0][1] = applePosY;
  snakeBody.unshift([snakeBodyHeadX, snakeBodyHeadY]);
}

function checkCollision() {
  for (var i = 1; i < snakeBody.length; i++) {
    if(snakeBody[i][0] === snakeHeadPositionX && snakeBody[i][1] === snakeHeadPositionY) {
      return true;
    }
  }
  return false;
}

function endGame() {
  clearInterval(gameRefreshInterval);
  window.removeEventListener('keydown', moveKeyPressed);
  ctx.textAlign = "center";
  ctx.fillText("Game Over", cw/2, ch/2);
  isGameRunning = false;

}
