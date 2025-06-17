// Obtém o elemento do HTML e seu contexto 2D
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define o tamanho de cada "bloco" da grade (20x20 pixels)
const box = 20;

// Inicializa a cobra com um segmento (a cabeça), no centro do canvas
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

// Gera a comida da cobra em uma posição aleatória dentro da grade
let food = {
  x: Math.floor(Math.random() * 19) * box,
  y: Math.floor(Math.random() * 19) * box
};

// Direção atual da cobra (up, down, left, right ou null)
let direction = null;

// Armazena o identificador do jogo (intervalo de tempo)
let game;

// Evento de clique no botão "Start" para iniciar/reiniciar o jogo
document.getElementById('startBtn').addEventListener('click', () => {
  if (game) clearInterval(game); // para o jogo anterior, se existir

  // Reinicializa a cobra e direção
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;

  // Gera nova posição da comida
  food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
  };

  // Inicia o loop do jogo, chamando a função draw a cada 100ms
  game = setInterval(draw, 100);
});

// Evento de teclado para mudar a direção da cobra
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowUp' && direction !== 'down') direction = 'up';
  else if (event.key === 'ArrowDown' && direction !== 'up') direction = 'down';
  else if (event.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
  else if (event.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

// Função para desenhar um segmento da cobra em estilo pixel art
function drawPixelSnakePart(x, y, isHead = false) {
  const size = box;
  const pixelSize = size / 4;

  const bodyColor = "#4CAF50";    // cor do corpo
  const headColor = "#a5d6a7";    // cor da cabeça
  const eyeColor = "#000";        // cor dos olhos

  ctx.fillStyle = isHead ? headColor : bodyColor;

  // Desenha 4x4 pixels, ignorando os cantos para suavizar visual
  for (let px = 0; px < 4; px++) {
    for (let py = 0; py < 4; py++) {
      if ((px === 0 && py === 0) || (px === 3 && py === 0) || (px === 0 && py === 3) || (px === 3 && py === 3)) {
        continue; // ignora cantos
      }
      ctx.fillRect(x + px * pixelSize, y + py * pixelSize, pixelSize - 1, pixelSize - 1);
    }
  }

  // Desenha os olhos se for a cabeça
  if (isHead) {
    ctx.fillStyle = eyeColor;
    const eyeSize = pixelSize;
    ctx.fillRect(x + pixelSize, y + pixelSize, eyeSize, eyeSize);           // olho esquerdo
    ctx.fillRect(x + 2 * pixelSize, y + pixelSize, eyeSize, eyeSize);       // olho direito
  }
}

// Função para desenhar a comida (maçã) em estilo pixel art
function drawPixelFood(x, y) {
  const size = box;
  const pixelSize = size / 4;

  const appleRed = "#d32f2f";   // cor da maçã
  const leafGreen = "#388e3c";  // cor da folha

  ctx.fillStyle = appleRed;
  // Desenha 3x3 pixels centralizados para formar a maçã
  for (let px = 0; px < 3; px++) {
    for (let py = 0; py < 3; py++) {
      ctx.fillRect(x + px * pixelSize + pixelSize / 2, y + py * pixelSize + pixelSize / 2, pixelSize - 1, pixelSize - 1);
    }
  }

  // Desenha uma folha verde na parte superior da maçã
  ctx.fillStyle = leafGreen;
  ctx.fillRect(x + pixelSize * 2, y + pixelSize / 2, pixelSize - 1, pixelSize - 1);
}

// Função principal que desenha a tela a cada frame
function draw() {
  // Limpa o canvas antes de redesenhar
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha cada parte da cobra, destacando a cabeça
  snake.forEach((segment, i) => drawPixelSnakePart(segment.x, segment.y, i === 0));

  // Desenha a comida (maçã)
  drawPixelFood(food.x, food.y);

  // Se nenhuma direção foi definida, não move a cobra ainda
  if (!direction) return;

  // Define a nova posição da cabeça com base na direção
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "right") headX += box;
  if (direction === "left") headX -= box;
  if (direction === "up") headY -= box;
  if (direction === "down") headY += box;

  // Verifica colisão com paredes ou com o próprio corpo
  if (
    headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height ||
    snake.some((seg, index) => index > 0 && seg.x === headX && seg.y === headY)
  ) {
    clearInterval(game);  // para o jogo
    alert("🐍 Fim de jogo!"); // mostra alerta de game over
    return;
  }

  // Verifica se a cobra comeu a maçã
  if (headX === food.x && headY === food.y) {
    // Gera nova comida em posição aleatória
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box
    };
  } else {
    // Remove o último segmento (movimento sem crescer)
    snake.pop();
  }

  // Adiciona nova cabeça à cobra (movimento)
  snake.unshift({ x: headX, y: headY });
}
