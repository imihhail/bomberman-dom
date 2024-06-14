console.log('Conneted!');
import { NewElement, Point } from '../../../../../mini-framework/index.js';
// import './bobermanMain.css';

let tick = 0;
let tickSpeed = 3;
let playerSpeed = 1;
let lastTimestamp = performance.now();
const minFrameTime = 1000 / 60;
let moveDirection = null;

export const generateGrid = (grid) => {
  const gameGrid = NewElement('div', 'gameContainer');
  for (let y = 0; y < 13; y++) {
    const row = NewElement('div', 'map-row');
    for (let x = 0; x < 15; x++) {
      const column = NewElement('div', 'square');
      if (grid[x][y].WallType == 9) {
        column.classList.add('indestructible-wall');
        column.setAttribute('indestructible', 'indestructible');
      } else if (grid[x][y].WallType == 1) {
        column.classList.add('walk-tile', 'destroyable-wall');
      } else {
        column.classList.add('walk-tile');
      }
      row.appendChild(column);
    }
    gameGrid.appendChild(row);
  }
  return gameGrid;
};

const player1MoveLeft = [
  './assets/characters/blue/moveL6.png',
  './assets/characters/blue/moveL5.png',
  './assets/characters/blue/moveL4.png',
  './assets/characters/blue/moveL3.png',
  './assets/characters/blue/moveL2.png',
  './assets/characters/blue/moveL1.png',
];
const player1MoveRight = [
  './assets/characters/blue/moveR1.png',
  './assets/characters/blue/moveR2.png',
  './assets/characters/blue/moveR3.png',
  './assets/characters/blue/moveR4.png',
  './assets/characters/blue/moveR5.png',
  './assets/characters/blue/moveR6.png',
];

const stopMovement = (e) => {
  if (
    (moveDirection === 'up' && e.code === 'ArrowUp') ||
    (moveDirection === 'down' && e.code === 'ArrowDown') ||
    (moveDirection === 'left' && e.code === 'ArrowLeft') ||
    (moveDirection === 'right' && e.code === 'ArrowRight')
  ) {
    moveDirection = null;
  }
};

const handleMovemement = (e) => {
  switch (e.code) {
    case 'ArrowUp':
      moveDirection = 'up';
      break;
    case 'ArrowDown':
      moveDirection = 'down';
      break;
    case 'ArrowLeft':
      moveDirection = 'left';
      break;
    case 'ArrowRight':
      moveDirection = 'right';
      break;
    case 'Space':
      // place bomb
      break;
  }
};

export const initBomberman = (grid) => {
  let playerXLocation = 50;
  let playerYLocation = 50;

  Point('bomberman-root').appendChild(generateGrid(grid));
  const player1 = Point('gameContainer')[0].appendChild(
    NewElement('img', 'player1')
  );
  player1.src = './assets/characters/blue/frontS1.png';

  //animation
  const refresh = (timestamp) => {
    //max fps
    const deltaTime = timestamp - lastTimestamp;
    if (deltaTime < minFrameTime) {
      requestAnimationFrame(refresh);
      return;
    }
    // handle game speed
    if (tick >= tickSpeed) {
      tick = 0;
      switch (moveDirection) {
        case 'up':
          playerYLocation -= playerSpeed;
          player1.style.top = playerYLocation + 'px';
          break;
        case 'down':
          playerYLocation += playerSpeed;
          player1.style.top = playerYLocation + 'px';
          break;
        case 'left':
          player1.src = player1MoveLeft[playerXLocation % 6];
          playerXLocation -= playerSpeed;
          player1.style.left = playerXLocation + 'px';
          break;
        case 'right':
          player1.src = player1MoveRight[playerXLocation % 6];
          playerXLocation += playerSpeed;
          player1.style.left = playerXLocation + 'px';
          break;
      }
    }

    tick++;
    lastTimestamp = timestamp;
    requestAnimationFrame(refresh);
  };
  //keyboard
  window.addEventListener('keydown', handleMovemement);
  window.addEventListener('keyup', stopMovement);
  requestAnimationFrame(refresh);
};

initBomberman([
  [
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
  ],
  [
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
  ],
  [
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
  ],
  [
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
  ],
  [
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
  ],
  [
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
  ],
  [
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
  ],
  [
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
  ],
  [
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
  ],
  [
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
  ],
  [
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
  ],
  [
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
  ],
  [
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
  ],
  [
    { WallType: 9, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 0, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
  ],
  [
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
    { WallType: 9, PowerUp: 0 },
  ],
]);
