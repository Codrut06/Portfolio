var $ = {
  canvas: null,
  ctx: null,
  canvas2: null,
  ctx2: null,
  colors: {
    sky: "#D4F5FE",
    mountains: "#83CACE",
    ground: "#8FC04C",
    groundDark: "#73B043",
    road: "#606a7c",
    roadLine: "#FFF",
    hud: "#FFF"
  },
  settings: {
    fps: 60,
    skySize: 120,
    ground: {
      size: 350,
      min: 4,
      max: 120
    },
    road: {
      min: 76,
      max: 700
    }
  },
  state: {
    bgpos: 0,
    offset: 0,
    startDark: true,
    curve: 0,
    currentCurve: 0,
    turn: 1,
    speed: 27,  // Default starting speed
    initialSpeed: 27,  // Store the initial speed to reset properly
    xpos: 0,
    section: 50,
    car: {
      maxSpeed: 60,
      friction: 0.4,
      acc: 0.85,
      deAcc: 0.5
    },
    keypress: {
      up: false,
      left: false,
      right: false,
      down: false
    },
  },
  storage: {
    bg: null
  }
};

// Canvas initialization
$.canvas = document.getElementsByTagName("canvas")[0];
$.ctx = $.canvas.getContext("2d");
$.canvas2 = document.createElement("canvas");
$.canvas2.width = $.canvas.width;
$.canvas2.height = $.canvas.height;
$.ctx2 = $.canvas2.getContext("2d");

// Event listeners for keypresses
window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);

// Draw background and start game loop
drawBg();
draw();

/* ----------------- Game Loop Function ----------------- */
function draw() {
  setTimeout(function () {
    calcMovement();

    $.state.bgpos += $.state.currentCurve * 0.02 * ($.state.speed * 0.2);
    $.state.bgpos = $.state.bgpos % $.canvas.width;

    $.ctx.putImageData($.storage.bg, $.state.bgpos, 5);
    $.ctx.putImageData(
      $.storage.bg,
      $.state.bgpos > 0 ? $.state.bgpos - $.canvas.width : $.state.bgpos + $.canvas.width,
      5
    );

    $.state.offset += $.state.speed * 0.05;
    if ($.state.offset > $.settings.ground.min) {
      $.state.offset = $.settings.ground.min - $.state.offset;
      $.state.startDark = !$.state.startDark;
    }

    drawGround($.ctx, $.state.offset, $.colors.ground, $.colors.groundDark, $.canvas.width);
    drawRoad($.settings.road.min + 6, $.settings.road.max + 36, 10, $.colors.roadLine);
    drawGround($.ctx2, $.state.offset, $.colors.roadLine, $.colors.road, $.canvas.width);
    drawRoad($.settings.road.min, $.settings.road.max, 10, $.colors.road);
    drawRoad(3, 24, 0, $.ctx.createPattern($.canvas2, "repeat"));
    drawCar();
    drawHUD($.ctx, 630, 340, $.colors.hud);

    requestAnimationFrame(draw);
  }, 1000 / $.settings.fps);
}

/* ----------------- Game HUD ----------------- */
function drawHUD(ctx, centerX, centerY, color) {
  var radius = 60,
      tigs = [0, 45, 90, 135, 180, 225, 270, 315],
      maxSpeed = $.state.car.maxSpeed,
      currentSpeed = $.state.speed,
      angle = map(currentSpeed, 0, maxSpeed, 90, 360);

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  ctx.lineWidth = 6;
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.stroke();

  for (var i = 0; i < tigs.length; i++) {
    drawTig(ctx, centerX, centerY, radius, tigs[i], 6);
  }


  drawPointer(ctx, color, 40, centerX, centerY, angle);

  var speedColor = getSpeedColor(currentSpeed, maxSpeed);

  ctx.font = "20px Arial";
  ctx.fillStyle = speedColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#000000";
  ctx.strokeText(Math.round(currentSpeed) + " km/h", centerX, centerY);
  ctx.fillText(Math.round(currentSpeed) + " km/h", centerX, centerY);
}

function getSpeedColor(speed, maxSpeed) {
  var speedPercentage = (speed / maxSpeed) * 100;

  if (speedPercentage < 30) {
    return "#FF0000";
  } else if (speedPercentage >= 30 && speedPercentage <= 70) {
    return "#FFA500";
  } else {
    return "#00FF00";
  }
}

function drawPointer(ctx, color, radius, centerX, centerY, angle) {
  var point = getCirclePoint(centerX, centerY, radius - 20, angle),
      point2 = getCirclePoint(centerX, centerY, 5, angle + 90),
      point3 = getCirclePoint(centerX, centerY, 5, angle - 90);

  ctx.beginPath();
  ctx.strokeStyle = "#00FF00";
  ctx.lineCap = "round";
  ctx.lineWidth = 3;
  ctx.moveTo(point2.x, point2.y);
  ctx.lineTo(point.x, point.y);
  ctx.lineTo(point3.x, point3.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawTig(ctx, x, y, radius, angle, size) {
  var startPoint = getCirclePoint(x, y, radius - 4, angle),
      endPoint = getCirclePoint(x, y, radius - size, angle);

  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();
}

function getCirclePoint(x, y, radius, angle) {
  var radian = (angle / 180) * Math.PI;
  return { x: x + radius * Math.cos(radian), y: y + radius * Math.sin(radian) };
}

function map(value, min1, max1, min2, max2) {
  return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
}

/* ----------------- Movement Logic ----------------- */
function calcMovement() {
  var move = $.state.speed * 0.01;

  // Speed calculation
  if ($.state.keypress.up) {
    $.state.speed += $.state.car.acc - $.state.speed * 0.015;
  } else if ($.state.speed > 0) {
    $.state.speed -= $.state.car.friction;
  }

  if ($.state.keypress.down && $.state.speed > 0) {
    $.state.speed -= 1;
  }

  // Curve and turn logic
  $.state.xpos -= $.state.currentCurve * $.state.speed * 0.005;
  if ($.state.speed) {
    if ($.state.keypress.left) {
      $.state.xpos += (Math.abs($.state.turn) + 7 + ($.state.speed > $.state.car.maxSpeed / 4
        ? $.state.car.maxSpeed - $.state.speed / 2 : $.state.speed)) * 0.2;
      $.state.turn -= 1;
    }

    if ($.state.keypress.right) {
      $.state.xpos -= (Math.abs($.state.turn) + 7 + ($.state.speed > $.state.car.maxSpeed / 4
        ? $.state.car.maxSpeed - $.state.speed / 2 : $.state.speed)) * 0.2;
      $.state.turn += 1;
    }

    if (!$.state.keypress.left && !$.state.keypress.right) {
      $.state.turn += $.state.turn > 0 ? -0.25 : 0.25;
    }
  }

  $.state.turn = clamp($.state.turn, -5, 5);
  $.state.speed = clamp($.state.speed, 0, $.state.car.maxSpeed);
  updateSection();
}

function updateSection() {
  $.state.section -= $.state.speed;
  if ($.state.section < 0) {
    $.state.section = randomRange(1000, 9000);
    var newCurve = randomRange(-50, 50);
    $.state.curve = (Math.abs($.state.curve - newCurve) < 20) ? randomRange(-50, 50) : newCurve;
  }

  adjustCurve();
}

function adjustCurve() {
  var move = $.state.speed * 0.01;
  if ($.state.currentCurve < $.state.curve && move < Math.abs($.state.currentCurve - $.state.curve)) {
    $.state.currentCurve += move;
  } else if ($.state.currentCurve > $.state.curve && move < Math.abs($.state.currentCurve - $.state.curve)) {
    $.state.currentCurve -= move;
  }
  $.state.xpos = clamp($.state.xpos, -650, 650);
}

/* ----------------- Event Listeners for Movement ----------------- */
function keyUp(e) {
  move(e, false);
}

function keyDown(e) {
  move(e, true);
}

function move(e, isKeyDown) {
  if (e.keyCode >= 37 && e.keyCode <= 40) e.preventDefault();

  switch (e.keyCode) {
    case 37: $.state.keypress.left = isKeyDown; break;
    case 38: $.state.keypress.up = isKeyDown; break;
    case 39: $.state.keypress.right = isKeyDown; break;
    case 40: $.state.keypress.down = isKeyDown; break;
  }
}

/* ----------------- Utility Functions ----------------- */
function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function norm(value, min, max) {
  return (value - min) / (max - min);
}

function lerp(norm, min, max) {
  return (max - min) * norm + min;
}

function map(value, sourceMin, sourceMax, destMin, destMax) {
  return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/* ----------------- Drawing Functions ----------------- */
function drawBg() {
  $.ctx.fillStyle = $.colors.sky;
  $.ctx.fillRect(0, 0, $.canvas.width, $.settings.skySize);
  drawMountain(0, 60, 200);
  drawMountain(280, 40, 200);
  drawMountain(400, 80, 200);
  drawMountain(550, 60, 200);

  $.storage.bg = $.ctx.getImageData(0, 0, $.canvas.width, $.canvas.height);
}

function drawMountain(pos, height, width) {
  $.ctx.fillStyle = $.colors.mountains;
  $.ctx.strokeStyle = $.colors.mountains;
  $.ctx.lineJoin = "round";
  $.ctx.lineWidth = 20;
  $.ctx.beginPath();
  $.ctx.moveTo(pos, $.settings.skySize);
  $.ctx.lineTo(pos + width / 2, $.settings.skySize - height);
  $.ctx.lineTo(pos + width, $.settings.skySize);
  $.ctx.closePath();
  $.ctx.stroke();
  $.ctx.fill();
}

function drawGround(ctx, offset, lightColor, darkColor, width) {
  var pos = $.settings.skySize - $.settings.ground.min + offset,
      stepSize = 1, drawDark = $.state.startDark, firstRow = true;
  ctx.fillStyle = lightColor;
  ctx.fillRect(0, $.settings.skySize, width, $.settings.ground.size);

  ctx.fillStyle = darkColor;
  while (pos <= $.canvas.height) {
    stepSize = norm(pos, $.settings.skySize, $.canvas.height) * $.settings.ground.max;
    if (stepSize < $.settings.ground.min) stepSize = $.settings.ground.min;

    if (drawDark) {
      ctx.fillRect(0, pos < $.settings.skySize ? $.settings.skySize : pos, width, stepSize);
    }
    pos += stepSize;
    drawDark = !drawDark;
  }
}

function drawRoad(min, max, squishFactor, color) {
  var basePos = $.canvas.width + $.state.xpos;

  $.ctx.fillStyle = color;
  $.ctx.beginPath();
  $.ctx.moveTo((basePos + min) / 2 - $.state.currentCurve * 3, $.settings.skySize);
  $.ctx.quadraticCurveTo(basePos / 2 + min + $.state.currentCurve / 3 + squishFactor, $.settings.skySize + 52, (basePos + max) / 2, $.canvas.height);
  $.ctx.lineTo((basePos - max) / 2, $.canvas.height);
  $.ctx.quadraticCurveTo(basePos / 2 - min + $.state.currentCurve / 3 - squishFactor, $.settings.skySize + 52, (basePos - min) / 2 - $.state.currentCurve * 3, $.settings.skySize);
  $.ctx.closePath();
  $.ctx.fill();
}

function drawCar() {
  var carWidth = 160, carHeight = 50, carX = $.canvas.width / 2 - carWidth / 2, carY = 320;
  roundedRect($.ctx, "rgba(0, 0, 0, 0.35)", carX - 1 + $.state.turn, carY + (carHeight - 35), carWidth + 10, carHeight, 9);
  roundedRect($.ctx, "#111", carX, carY + (carHeight - 30), 30, 40, 6);
  roundedRect($.ctx, "#111", carX - 22 + carWidth, carY + (carHeight - 30), 30, 40, 6);
  drawCarBody($.ctx);
}

function drawCarBody(ctx) {
  var startX = 299, startY = 311, lights = [10, 26, 134, 152], lightsY = 0;

  roundedRect($.ctx, "#C2C2C2", startX + 6 + $.state.turn * 1.1, startY - 18, 146, 40, 18);
  ctx.beginPath();
  ctx.lineWidth = "12";
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#FFFFFF";
  ctx.moveTo(startX + 30, startY);
  ctx.lineTo(startX + 46 + $.state.turn, startY - 25);
  ctx.lineTo(startX + 114 + $.state.turn, startY - 25);
  ctx.lineTo(startX + 130, startY);
  ctx.fill();
  ctx.stroke();

  ctx.lineWidth = "12";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.fillStyle = "#DEE0E2";
  ctx.strokeStyle = "#DEE0E2";
  ctx.moveTo(startX + 2, startY + 12 + $.state.turn * 0.2);
  ctx.lineTo(startX + 159, startY + 12 + $.state.turn * 0.2);
  ctx.quadraticCurveTo(startX + 166, startY + 35, startX + 159, startY + 55 + $.state.turn * 0.2);
  ctx.lineTo(startX + 2, startY + 55 - $.state.turn * 0.2);
  ctx.quadraticCurveTo(startX - 5, startY + 32, startX + 2, startY + 12 - $.state.turn * 0.2);
  ctx.fill();
  ctx.stroke();

  roundedRect(ctx, "#474747", startX - 4, startY, 169, 10, 3, true, 0.2);
  roundedRect(ctx, "#474747", startX + 40, startY + 5, 80, 10, 5, true, 0.1);
  drawCarLights(ctx, startX, startY, lights, lightsY);
}

function drawCarLights(ctx, startX, startY, lights, lightsY) {
  ctx.fillStyle = "#FF9166";
  lights.forEach(function (xPos) {
    ctx.beginPath();
    ctx.arc(startX + xPos, startY + 20 + lightsY, 6, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    lightsY += $.state.turn * 0.05;
  });
}

/* ----------------- Utility for Drawing Rounded Rectangles ----------------- */
function roundedRect(ctx, color, x, y, width, height, radius, turn, turneffect) {
  var skew = turn === true ? $.state.turn * turneffect : 0;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, y - skew);
  ctx.lineTo(x + width - radius, y + skew);
  ctx.arcTo(x + width, y + skew, x + width, y + radius + skew, radius);
  ctx.lineTo(x + width, y + radius + skew);
  ctx.lineTo(x + width, y + height + skew - radius);
  ctx.arcTo(x + width, y + height + skew, x + width - radius, y + height + skew, radius);
  ctx.lineTo(x + width - radius, y + height + skew);
  ctx.lineTo(x + radius, y + height - skew);
  ctx.arcTo(x, y + height - skew, x, y + height - skew - radius, radius);
  ctx.lineTo(x, y + height - skew - radius);
  ctx.lineTo(x, y + radius - skew);
  ctx.arcTo(x, y - skew, x + radius, y - skew, radius);
  ctx.lineTo(x + radius, y - skew);
  ctx.fill();
}

/* ----------------- Timer and Game Control ----------------- */
let timerStarted = false;
let timeLeft = 60;
let gameActive = true;
let timerInterval, gameInterval;

function updateTimer() {
  const timerElement = document.getElementById('timer');
  timerElement.textContent = timeLeft + " secunde";
  if (timeLeft > 0) {
    timeLeft--;
  } else {
    clearInterval(timerInterval);
    stopGame();
  }
}

function startTimerOnFirstKeyPress() {
  if (!timerStarted && gameActive) {
    timerStarted = true;
    timerInterval = setInterval(updateTimer, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerStarted = false;
  timeLeft = 60;
  updateTimer();
  startTimerOnFirstKeyPress();
}

function handleKeyPress(event) {
  if (!gameActive) return;
  console.log("Ai apăsat tasta: " + event.key);
}

function stopGame() {
  gameActive = false;
  clearInterval(timerInterval);
  document.removeEventListener('keydown', handleKeyPress);

  const gameOverMessage = document.getElementById('game-over-message');
  gameOverMessage.style.display = 'block';

  const overlay = document.createElement('div');
  overlay.id = 'game-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '998';
  document.body.appendChild(overlay);

  document.getElementById('game-menu').style.zIndex = '999';
}

// Event listeners
window.addEventListener('keydown', startTimerOnFirstKeyPress);
document.addEventListener('keydown', handleKeyPress);

// Game menu interaction
document.getElementById('new-game-button').addEventListener('click', startNewGame);
document.getElementById('exit-button').addEventListener('click', exitGame);


// Select the button and the body element
const nightModeButton = document.getElementById('night-mode-button');
const body = document.body;

// Add an event listener to switch between day and night
nightModeButton.addEventListener('click', function() {
    body.classList.toggle('night-mode');


});

// New Game
let animationFrameId;

function startNewGame() {
    cancelAnimationFrame(animationFrameId);

    gameActive = true;
    $.state.speed = $.state.initialSpeed;
    $.state.xpos = 0;

    document.getElementById('game-over-message').style.display = 'none';

    const overlay = document.getElementById('game-overlay');
    if (overlay) overlay.remove();

    requestAnimationFrame(draw);
    resetTimer();
}

// Exit Game
function exitGame() {
    if (gameActive) {
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        gameActive = false;

        // Display the exit message
        const exitMessage = document.getElementById("exit-message");
        exitMessage.style.display = "block";
        exitMessage.classList.add("fade-in");

        // Add a transition animation (fade-out) for canvas and controls
        document.getElementById("gameCanvas").classList.add("fade-out");
        document.getElementById("controls").classList.add("fade-out");

        // After 10 seconds, redirect
        setTimeout(() => {
            window.location.href = "index.html";
        }, 10000);
    }
}

document.getElementById('game-menu').style.display = 'block';

requestAnimationFrame(draw);
