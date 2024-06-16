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
let tickSpeed = 1;
let playerSpeed = 2;
let bombsPlaced = false;
let bombFrameCounter = 0;
// let bombPower = 1;
let lastTimestamp = performance.now();
const minFrameTime = 1000 / 60;
let moveDirection = null;

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
      bombsPlaced = true; // bombsPlaced + 1
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

export const updateBombPositions = (playerX, playerY) => {

  if (bombsPlaced) {
    console.log(playerX, playerY)
    // Calculate which square div the bomb should be placed in
    let squareX = Math.floor((playerX+25) / 50);
    let squareY = Math.floor((playerY+25) / 50);

    const getAllTiles = document.querySelectorAll('.square')
    let coordCalculation = squareY * 15 + squareX;
    let tile = getAllTiles[coordCalculation];

    // Create a new bomb element
    const bomb = document.createElement('img');
    bomb.classList.add('bomb');
    bomb.src = BombInit[0]; // Set the initial bomb image
    tile.appendChild(bomb);
    bombsPlaced = false;
  }
};

const updateBombExplosion = () => {
  // Update bomb animations
  const allBombs = document.querySelectorAll('.bomb');
  allBombs.forEach(bomb => {
    bombFrameCounter++;
    let frame = Math.floor(bombFrameCounter / 60) % BombInit.length; // Calculate the frame index
    if (bombFrameCounter % 60 === 0) { // Only update the bomb image once per second
      bomb.src = BombInit[frame]; // Update the bomb image
      if (frame >= 3) { // If it's the third frame or later
        bomb.remove(); // Remove the bomb from the DOM
      }
    }
  });
}

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

  // movement

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
          playersRef.current[gameTag].y -= playerSpeed;
          break;
        case 'down':
          playersRef.current[gameTag].y += playerSpeed;
          break;
        case 'left':
          playersRef.current[gameTag].x -= playerSpeed;
          break;
        case 'right':
          playersRef.current[gameTag].x += playerSpeed;
          break;
      }

      updatePlayerPosition(
        playersRef.current[gameTag].element,
        playersRef.current[gameTag].x,
        playersRef.current[gameTag].y,
      );

      updateBombPositions(
        playersRef.current[gameTag].x,
        playersRef.current[gameTag].y
      );

      updateBombExplosion();

      sendJsonMessage({
        type: 'bombermanCoords',
        fromuserid: currentUser,
        gameTag: gameTag,
        gameGroup: group,
        coordX: playersRef.current[gameTag].x.toString(),
        coordY: playersRef.current[gameTag].y.toString(),
      });
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
