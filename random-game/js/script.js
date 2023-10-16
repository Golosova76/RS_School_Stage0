'use strict'
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

//скорость игры
let gameSpeed = 200;

const playGround = new Image();
playGround.src = 'img/playground.png'

const appleImage = new Image();
appleImage.src = 'img/apple30.png'

//размер одной клетки
const boxSize = 31.5;

//счетчик на сайте
const scoreValue = document.querySelector('.score__value');

// Получаем ссылку на элемент <header>
const headerElement = document.querySelector('header');

//получаем элементы для скорости игры
const speedRange = document.querySelector('#speedRange');
const speedDisplay = document.querySelector('#speedDisplay');

//змейка 
let snake;
//
let user = 'user';
//еда
let food;
//счетчик
let score = 0;
//движение
let direction;
//игра 
let gameInterval;
//флаг 
let isGameOver = false;

//функция инициализации
function initializeGame() {
  //рисуем начальное положение змейки
  snake = [];
  snake[0] = {
    x: 10 * boxSize,
    y: 10 * boxSize
  }

  //snake.splice(1, snake.length - 1);

  spawnFood();
  spawnSnake();
  score = 0;
  isGameOver = false;
  direction = 'right';
  scoreValue.textContent = '0';

  gameSpeed = parseInt(speedRange.value); // Установка начальной скорости игры
  speedDisplay.textContent = `Game Speed: ${gameSpeed} ms`;
  
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(drawSnake, gameSpeed);
}

//рисуем случайное положение еды
function spawnFood() {
  const x = Math.floor(Math.random() * 20) * boxSize;
  const y = Math.floor(Math.random() * 20) * boxSize;
  food = {x, y};
}

//рисуем змейку
function spawnSnake() {
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? 'green' : 'rgb(7, 66, 7)';
    ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
  }
}


//слушаем событие нажатие кнопки на всем документе
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' && direction !== 'down') direction = 'up';
  else if (event.key === 'ArrowDown' && direction !== 'up') direction = 'down';
  else if (event.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
  else if (event.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

//слушаем событие input
gameSpeed = parseInt(speedRange.value);

speedRange.addEventListener('input', () => {
  gameSpeed = parseInt(speedRange.value);
  speedDisplay.textContent = `Game Speed: ${gameSpeed} ms`;
  clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, gameSpeed);
});


//если змейка укусит себя
function eatSnake(head, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (head.x === arr[i].x && head.y === arr[i].y) {
      endGame();
      return;
    }
  }
}


//основная функция игры
function drawSnake() {
  ctx.drawImage(playGround, 0, 0); //нарисовали поле

  ctx.drawImage(appleImage, food.x, food.y) //нарисовали еду

  if (isGameOver) return;

  //spawnSnake(); //нарисовали змейку

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  //съедаем еду
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreValue.textContent = `${score}`;
    spawnFood();
  } else {
    snake.pop();
  }

  if (snakeX < boxSize || snakeX > boxSize * 20 || snakeY < boxSize || snakeY > boxSize * 20) {
    endGame();
    return;
  }

  //двигаем змейку
  if (direction === 'up') snakeY -= boxSize;
  else if (direction === 'down') snakeY += boxSize;
  else if (direction === 'left') snakeX -= boxSize;
  else if (direction === 'right') snakeX += boxSize;

  let newSnake = {
    x: snakeX,
    y: snakeY
  }

  eatSnake(newSnake, snake);

  snake.unshift(newSnake);

  spawnSnake();
}

function updateGame() {
  drawSnake();
}

function endGame() {
  isGameOver = true;
  clearInterval(gameInterval);
  // Получаем предыдущие результаты из localStorage или создаем новый массив
  let gameResults = JSON.parse(localStorage.getItem('gameResults')) || [];
  // Добавляем текущий результат в массив
  gameResults.push({ user, score, gameSpeed });
  gameResults = gameResults.slice(-10); // Сохранять только 10 последних результатов
  // Сохраняем массив результатов в localStorage
  localStorage.setItem('gameResults', JSON.stringify(gameResults));

  // отображение сообщения
  const gameOverMessage = document.createElement('div');
  gameOverMessage.textContent = 'Game over! Your score: ' + score;
  gameOverMessage.classList.add('game-over-message');
  headerElement.appendChild(gameOverMessage);
  //рестарт игры через 3сек
  setTimeout(() => {
    gameOverMessage.remove(); // Удаляем сообщение после 3 секунд
    initializeGame(); 
  }, 3000);
  //setTimeout(initializeGame, 3000)
  //scoreValue.textContent = '0';
}

initializeGame();