const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20; // tamanho do pixel quadrado (bloco)

let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
  x: Math.floor(Math.random() * 19) * box,
  y: Math.floor(Math.random() * 19) * box
};

let direction = null;
let game;

document.getElementById('startBtn').addEventListener('click', () => {
  if (game) clearInterval(game);
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
  };
  game = setInterval(draw, 100);
});

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowUp' && direction !== 'down') direction = 'up';
  else if (event.key === 'ArrowDown' && direction !== 'up') direction = 'down';
  else if (event.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
  else if (event.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

function drawPixelSnakePart(x, y, isHead = false) {
  const size = box;
  const pixelSize = size / 4;

  const bodyColor = "#4CAF50";
  const headColor = "#a5d6a7";
  const eyeColor = "#000";

  ctx.fillStyle = isHead ? headColor : bodyColor;

  for (let px = 0; px < 4; px++) {
    for (let py = 0; py < 4; py++) {
      if ((px === 0 && py === 0) || (px === 3 && py === 0) || (px === 0 && py === 3) || (px === 3 && py === 3)) {
        continue; // cantos transparentes para suavizar
      }
      ctx.fillRect(x + px * pixelSize, y + py * pixelSize, pixelSize - 1, pixelSize - 1);
    }
  }

  if (isHead) {
    ctx.fillStyle = eyeColor;
    const eyeSize = pixelSize;
    ctx.fillRect(x + pixelSize, y + pixelSize, eyeSize, eyeSize);
    ctx.fillRect(x + 2 * pixelSize, y + pixelSize, eyeSize, eyeSize);
  }
}

function drawPixelFood(x, y) {
  const size = box;
  const pixelSize = size / 4;

  const appleRed = "#d32f2f";
  const leafGreen = "#388e3c";

  ctx.fillStyle = appleRed;
  for (let px = 0; px < 3; px++) {
    for (let py = 0; py < 3; py++) {
      ctx.fillRect(x + px * pixelSize + pixelSize / 2, y + py * pixelSize + pixelSize / 2, pixelSize - 1, pixelSize - 1);
    }
  }

  ctx.fillStyle = leafGreen;
  ctx.fillRect(x + pixelSize * 2, y + pixelSize / 2, pixelSize - 1, pixelSize - 1);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, i) => drawPixelSnakePart(segment.x, segment.y, i === 0));
  drawPixelFood(food.x, food.y);

  if (!direction) return; // não mexer se não iniciou movimento

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "right") headX += box;
  if (direction === "left") headX -= box;
  if (direction === "up") headY -= box;
  if (direction === "down") headY += box;

  // colisão com parede ou com o próprio corpo
  if (
    headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height ||
    snake.some((seg, index) => index > 0 && seg.x === headX && seg.y === headY)
  ) {
    clearInterval(game);
    alert("🐍 Fim de jogo!");
    return;
  }

  // comeu a maçã?
  if (headX === food.x && headY === food.y) {
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box
    };
  } else {
    snake.pop();
  }

  snake.unshift({ x: headX, y: headY });
}
