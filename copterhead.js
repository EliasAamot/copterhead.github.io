var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

var copterHeadImage = new Image();
copterHeadImage.src = 'head.png';

var rockImage = new Image();
rockImage.src = 'rock.png';

var copterX = 0;
const copterY = 505;
var copterDirection = 0;

const LEFT_KEY = 37;
const RIGHT_KEY = 39;

var rocks = [];

var crash = false;

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(copterHeadImage, copterX, copterY);

  for (var rock of rocks) {
    context.drawImage(rockImage, rock['x'], rock['y']);
  }
}

function mainLoop() {
  // Update player
  nextCopterX = copterX + copterDirection;
  if (nextCopterX < 0 || nextCopterX > (canvas.width - copterHeadImage.width)) {
    copterDirection = 0;
  }
  copterX += copterDirection;

  // Update falling objects
  for (var rock of rocks) {
    rock['y'] += 1;
    if (isCollision(copterX, copterY, rock['x'], rock['y'])) {
      crash = true;
    }
  }

  // Spawn rock
  if (Math.random() < 0.01) {
    var newRock = {'x': Math.random() * canvas.width, 'y': 0};
    rocks.push(newRock);
  }

  if (!crash) {
    draw();
  }
}

// Add listeners
var keysPressed = {}

function keyDownHandler(e) {
  if (e.keyCode == LEFT_KEY) {
    copterDirection = -1;
  }
  if (e.keyCode == RIGHT_KEY) {
    copterDirection = 1;
  }
}

function mouseDownHandler(e) {
  if (e.pageX > (canvas.width / 2)) {
    copterDirection = 1;
  } else {
    copterDirection = -1;
  }
}

function isCollision(o1x, o1y, o2x, o2y) {
  var normalized_o1x = o1x + (copterHeadImage.width / 2);
  var normalized_o1y = o1y + (copterHeadImage.height / 2);
  var normalized_o2x = o2x + (rockImage.width / 2);
  var normalized_o2y = o2y + (rockImage.height / 2);

  var x_dist = (normalized_o1x - normalized_o2x) ** 2;
  var y_dist = (normalized_o1y - normalized_o2y) ** 2;
  
  return Math.sqrt(x_dist + y_dist) < 16;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);

setInterval(mainLoop, 5);
