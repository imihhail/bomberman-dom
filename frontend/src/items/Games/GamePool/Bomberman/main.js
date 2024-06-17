console.log('Conneted!');
import { NewElement, Point } from '../../../../../mini-framework/index.js';
import {
  GenerateGrid,
  Player1MoveLeft,
  Player1MoveRight,
  Player1MoveTop,
  Player1MoveBottom,
  Player2MoveLeft,
  Player2MoveRight,
  Player2MoveTop,
  Player2MoveBottom,
  Player3MoveLeft,
  Player3MoveRight,
  Player3MoveTop,
  Player3MoveBottom,
  Player4MoveLeft,
  Player4MoveRight,
  Player4MoveTop,
  Player4MoveBottom,
  BombInit,
} from './components.js';
import player1FrontStyle from './assets/characters/blue/frontS1.png';
import player2FrontStyle from './assets/characters/green/frontS1.png';
import player3FrontStyle from './assets/characters/pink/frontS1.png';
import player4FrontStyle from './assets/characters/red/frontS1.png';
import './bobermanMain.css';

let tick = 0;
let tickSpeed = 12;
let playerSpeed = 2;
let bombPlaced = false;
// let bombPower = 1;
let lastTimestamp = performance.now();
const minFrameTime = 1000 / 60;
let moveDirection = null;

class Bomb {
  constructor(coordCalculation, bombLevel, animationNumber) {
    this.coordCalculation = coordCalculation;
    this.bombLevel = bombLevel;
    this.animationNumber = animationNumber;
  }
}

let bombs = [];

const stopMovement = (e) => {
  if (
    (moveDirection === 'up' && e.code === 'ArrowUp') ||
    (moveDirection === 'up' && e.code === 'KeyW') ||
    (moveDirection === 'down' && e.code === 'ArrowDown') ||
    (moveDirection === 'down' && e.code === 'KeyS') ||
    (moveDirection === 'left' && e.code === 'ArrowLeft') ||
    (moveDirection === 'left' && e.code === 'KeyA') ||
    (moveDirection === 'right' && e.code === 'ArrowRight') ||
    (moveDirection === 'right' && e.code === 'KeyD')
  ) {
    moveDirection = null;
  }
};

const handleMovemement = (e) => {
  switch (e.code) {
    case 'ArrowUp':
      moveDirection = 'up';
      break;
    case 'KeyW':
      moveDirection = 'up';
      break;
    case 'ArrowDown':
      moveDirection = 'down';
      break;
    case 'KeyS':
      moveDirection = 'down';
      break;
    case 'ArrowLeft':
      moveDirection = 'left';
      break;
    case 'KeyA':
      moveDirection = 'left';
      break;
    case 'ArrowRight':
      moveDirection = 'right';
      break;
    case 'KeyD':
      moveDirection = 'right';
      break;
    case 'Space':
      bombPlaced = true; // bombsPlaced + 1
      break;
  }
};

export const updatePlayerPosition = (player, x, y) => {
  // animation?
  let playerPrevCoordX = player.style.left.slice(0, -2);
  let playerPrevCoordY = player.style.top.slice(0, -2);
  if (playerPrevCoordX > x) {
    switch (player.className) {
      case 'player1':
        player.src = Player1MoveLeft[Math.floor((x / playerSpeed) % 6)];
        break;
      case 'player2':
        player.src = Player2MoveLeft[Math.floor((x / playerSpeed) % 6)];
        break;
      case 'player3':
        player.src = Player3MoveLeft[Math.floor((x / playerSpeed) % 6)];
        break;
      case 'player4':
        player.src = Player4MoveLeft[Math.floor((x / playerSpeed) % 6)];
        break;
    }
  } else if (playerPrevCoordX < x) {
    switch (player.className) {
      case 'player1':
        player.src = Player1MoveRight[Math.floor((x / playerSpeed) % 6)];
        break;
      case 'player2':
        player.src = Player2MoveRight[Math.floor((x / playerSpeed) % 6)];
        break;
      case 'player3':
        player.src = Player3MoveRight[Math.floor((x / playerSpeed) % 6)];
        break;
      case 'player4':
        player.src = Player4MoveRight[Math.floor((x / playerSpeed) % 6)];
        break;
    }
  } else if (playerPrevCoordY > y) {
    switch (player.className) {
      case 'player1':
        player.src = Player1MoveTop[Math.floor((y / playerSpeed) % 6)];
        break;
      case 'player2':
        player.src = Player2MoveTop[Math.floor((y / playerSpeed) % 6)];
        break;
      case 'player3':
        player.src = Player3MoveTop[Math.floor((y / playerSpeed) % 6)];
        break;
      case 'player4':
        player.src = Player4MoveTop[Math.floor((y / playerSpeed) % 6)];
        break;
    }
  } else if (playerPrevCoordY < y) {
    switch (player.className) {
      case 'player1':
        player.src = Player1MoveBottom[Math.floor((y / playerSpeed) % 6)];
        break;
      case 'player2':
        player.src = Player2MoveBottom[Math.floor((y / playerSpeed) % 6)];
        break;
      case 'player3':
        player.src = Player3MoveBottom[Math.floor((y / playerSpeed) % 6)];
        break;
      case 'player4':
        player.src = Player4MoveBottom[Math.floor((y / playerSpeed) % 6)];
        break;
    }
  }
  // move player
  player.style.left = x + 'px';
  player.style.top = y + 'px';
};

const userPlacedBomb = (playerX, playerY) => {
  let coordCalculation = calculateBombPosition(playerX, playerY);
  // Check if a bomb with the same coordCalculation already exists
  if (bombs.some(bomb => bomb.coordCalculation === coordCalculation)) {
    bombPlaced = false;
    return;
  }
  let bombActiveLevel = 1;
  let bombAnimationNumber = 0;
  let bomb = new Bomb(coordCalculation, bombActiveLevel, bombAnimationNumber);
  bombs.push(bomb);
  console.log('Bombs: ', bombs);
  bombPlaced = false;
}

const calculateBombPosition = (playerX, playerY) => {
  // Calculate which square div the bomb should be placed in
  let squareX = Math.floor((playerX+25) / 50);
  let squareY = Math.floor((playerY+25) / 50);

  let coordCalculation = squareY * 15 + squareX;
  return coordCalculation;
};

export const updateBombPosition = (bombs) => {
  const getAllTiles = document.querySelectorAll('.square')

  bombs.forEach((bomb, index) => {
    let tile = getAllTiles[bomb.coordCalculation];
    // Check if a bomb already exists at this position
    let bombElement = tile.querySelector('.bomb');
    if (!bombElement) {
      // Create a new bomb element
      bombElement = document.createElement('img');
      bombElement.classList.add('bomb');
      bombElement.src = BombInit[0]; // Set the initial bomb image
      tile.appendChild(bombElement);
      bombPlaced = false;
    }

    // Update the bomb explosion
    bomb.animationNumber++;
    if (bombElement) {
      // Update the bomb image every 60 frames
      if (bomb.animationNumber % 60 === 0) {
        bombElement.src = BombInit[bomb.animationNumber / 60]; 
      }
    }

    if (bomb.animationNumber / 60 > 3) { // If it's the fourth frame or later, maybe third? must experiment
      // Remove the bomb from the bombs array
      bombs.splice(index, 1);
      // Remove the bomb from the DOM
      if (bombElement) {
        bombElement.remove();
      }
    }
  });
};


export const initBomberman = (
  grid,
  gameTag,
  group,
  sendJsonMessage,
  playersRef,
  currentUser
) => {
  Point('bomberman-root').appendChild(GenerateGrid(grid));

  const player1 = Point('gameContainer')[0].appendChild(
    NewElement('img', 'player1')
  );
  let player1XCoord = 50;
  let player1YCoord = 50;
  player1.src = player1FrontStyle;
  player1.style.left = player1XCoord + 'px';
  player1.style.top = player1YCoord + 'px';

  // player2
  const player2 = Point('gameContainer')[0].appendChild(
    NewElement('img', 'player2')
  );
  let player2XCoord = 650;
  let player2YCoord = 50;
  player2.src = player2FrontStyle;
  player2.style.left = player2XCoord + 'px';
  player2.style.top = player2YCoord + 'px';

  // player3
  const player3 = Point('gameContainer')[0].appendChild(
    NewElement('img', 'player3')
  );
  let player3XCoord = 50;
  let player3YCoord = 550;
  player3.src = player3FrontStyle;
  player3.style.left = player3XCoord + 'px';
  player3.style.top = player3YCoord + 'px';

  // player4
  const player4 = Point('gameContainer')[0].appendChild(
    NewElement('img', 'player4')
  );
  let player4XCoord = 650;
  let player4YCoord = 550;
  player4.src = player4FrontStyle;
  player4.style.left = player4XCoord + 'px';
  player4.style.top = player4YCoord + 'px';

  playersRef.current = {
    player1: { element: player1, x: player1XCoord, y: player1YCoord },
    player2: { element: player2, x: player2XCoord, y: player2YCoord },
    player3: { element: player3, x: player3XCoord, y: player3YCoord },
    player4: { element: player4, x: player4XCoord, y: player4YCoord },
  };

  const gameMatrix = Point('square');
  gameMatrix[82].src
  console.log(gameMatrix);

  //animation
  const refresh = (timestamp) => {
    //limit fps to 60
    const deltaTime = timestamp - lastTimestamp;
    if (deltaTime < minFrameTime) {
      requestAnimationFrame(refresh);
      return;
    }

    // character movements
    switch (moveDirection) {
      case 'up':
        {
          const checkFutureY = playersRef.current[gameTag].y - playerSpeed;
          const checkFutureX = playersRef.current[gameTag].x;
          if (checkFutureY > 50 && Math.round(checkFutureX / 50) % 2 == 1) {
            playersRef.current[gameTag].y = checkFutureY;
          }
        }
        break;
      case 'down':
        {
          const checkFutureY = playersRef.current[gameTag].y + playerSpeed;
          const checkFutureX = playersRef.current[gameTag].x;
          if (checkFutureY <= 550 && Math.round(checkFutureX / 50) % 2 == 1) {
            playersRef.current[gameTag].y = checkFutureY;
          }
        }
        break;
      case 'left':
        {
          const checkFutureX = playersRef.current[gameTag].x - playerSpeed;
          const checkFutureY = playersRef.current[gameTag].y;
          if (checkFutureX > 50 && Math.round(checkFutureY / 50) % 2 == 1) {
            playersRef.current[gameTag].x = checkFutureX;
          }
        }
        break;
      case 'right':
        {
          const checkFutureX = playersRef.current[gameTag].x + playerSpeed;
          const checkFutureY = playersRef.current[gameTag].y;
          if (checkFutureX < 650 && Math.round(checkFutureY / 50) % 2 == 1) {
            playersRef.current[gameTag].x = checkFutureX;
          }
        }
        break;
    }

      updatePlayerPosition(
        playersRef.current[gameTag].element,
        playersRef.current[gameTag].x,
        playersRef.current[gameTag].y
      );

      if (bombPlaced) {
        userPlacedBomb(
          playersRef.current[gameTag].x,
          playersRef.current[gameTag].y
        );
      }
      updateBombPosition(bombs);
      sendJsonMessage({
        type: 'bombermanCoords',
        fromuserid: currentUser,
        gameTag: gameTag,
        gameGroup: group,
        coordX: playersRef.current[gameTag].x.toString(),
        coordY: playersRef.current[gameTag].y.toString(),
        bombs: bombs,
      });
    // limited tick speed 12 ticks / 5/s
    if (tick >= tickSpeed) {
      tick = 0;
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
