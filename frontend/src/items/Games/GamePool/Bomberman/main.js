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
  ExplosionStage1,
  ExplosionStage2,
  ExplosionStage3,
  ExplosionStage4,
  ExplosionStage5,
} from './components.js';
import player1FrontStyle from './assets/characters/blue/frontS1.png';
import player2FrontStyle from './assets/characters/green/frontS1.png';
import player3FrontStyle from './assets/characters/pink/frontS1.png';
import player4FrontStyle from './assets/characters/red/frontS1.png';
import './bobermanMain.css';

const explosionArray = [
  ExplosionStage1,
  ExplosionStage1,
  ExplosionStage2,
  ExplosionStage3,
  ExplosionStage4,
  ExplosionStage5,
];
let tick = 0;
let tickSpeed = 1;
let playerSpeed = 2;
let bombPlaced = false;
let bombAnimationInterval = 100;
let bombActiveLevel = 1;
let frameCount = 0;
let maxFrameCount = 0;
let lastSecondTimestamp = 0;
let lastSecondTimestampForMax = 0;
let tolerance = 15; // bigger number makes the walkpath wider
let lastTimestamp = performance.now();
const minFrameTime = 1000 / 60;
let moveDirection = null;
let json
let groupId
let playerTag

class Death {
  constructor(lives, dead, spawnX, spawnY){
    this.lives = lives
    this.dead = dead
    this.spawnX = spawnX
    this.spawnY = spawnY
  }
}

let playerLives = new Map([
  ["player1", new Death(3, false, 50, 50)],
  ["player2", new Death(3, false, 650, 50)],
  ["player3", new Death(3, false, 50, 550)],
  ["player4", new Death(3, false, 650, 550)]
]);

class Bomb {
  constructor(coordCalculation, bombLevel, animationNumber) {
    this.coordCalculation = coordCalculation;
    this.bombLevel = bombLevel;
    this.animationNumber = animationNumber;
  }
}
let maxBombs = 1;
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
  if (bombs.some((bomb) => bomb.coordCalculation === coordCalculation)) {
    bombPlaced = false;
    return;
  }

  let bombAnimationNumber = 0;
  let bomb = new Bomb(coordCalculation, bombActiveLevel, bombAnimationNumber);
  if (bombs.length < maxBombs) {
    bombs.push(bomb);
    bombPlaced = false;
  }
};

const calculateBombPosition = (playerX, playerY) => {
  // Calculate which square div the bomb should be placed in
  let squareX = Math.floor((playerX + 25) / 50);
  let squareY = Math.floor((playerY + 25) / 50);

  let coordCalculation = squareY * 15 + squareX;
  return coordCalculation;
};

const collusion = (element1, element2) => {
  let el1 = element1.getBoundingClientRect();
  let el2 = element2.getBoundingClientRect();
  if (
    el1.left + 8 < el2.right &&
    el1.right - 8 > el2.left &&
    el1.top + 8 < el2.bottom &&
    el1.bottom - 8 > el2.top
  ) {
    json({
      type: 'deadPlayer',
      deadPlayer: element1.className,
      gameTag: playerTag,
      gameGroup: groupId,
    })
  }
}

export const death = (playerDied) =>{
  const player = document.querySelector(`.${playerDied}`)
  if (player) {
    playerLives.get(playerDied).lives -= 1
    player.remove()
    playerLives.get(playerDied).dead = true
    if (playerLives.get(playerDied).lives != 0) {
      setTimeout(()=>{
        Point('gameContainer')[0].appendChild(player)
        playerLives.get(playerDied).dead = false
      }, 1000)
    }
  }
}

export const updateBombPosition = (bombs, grid) => {
  const getAllTiles = Point('square');

  bombs?.forEach((bomb, index) => {
    let tile = getAllTiles[bomb.coordCalculation];
    // Check if a bomb already exists at this position
    let bombElement = tile.parentElement.querySelector('.bomb');
    if (!bombElement) {
      // Create a new bomb element
      bombElement = NewElement('img', 'bomb');
      bombElement.src = BombInit[0]; // Set the initial bomb image
      tile.parentElement.appendChild(bombElement);
      bombPlaced = false;
    }
    // Update the bomb bulge animation
    bomb.animationNumber++;
    if (bombElement) {
      // Update the bomb image every 60 frames
      if (bomb.animationNumber % 60 === 0) {
        bombElement.src = BombInit[bomb.animationNumber / 60];
      }
    }
    if (bomb.animationNumber / 60 >= 3) {
      // If it's the fourth frame or later, maybe third? must experiment
      // Remove the bomb from the bombs array
      bombs.splice(index, 1);
      // Remove the bomb from the DOM
      if (bombElement) {       
        if (bomb.animationNumber % 60 === 0) {
          let player = document.querySelector(`.${playerTag}`)
          let imgContainer = tile.parentElement;
          bombElement.classList.remove('bomb');
          bombElement.classList.add('explosion');
          bombElement.src = explosionArray[0][1];
          player && collusion(player, imgContainer)

          // bomb animation
          let explosionIndex = 0;
          const explosionAnimation = setInterval(() => {
            player && collusion(player, imgContainer)
            bombElement.src = explosionArray[explosionIndex][1];
            explosionIndex++;
            if (explosionIndex == 5) {
              clearInterval(explosionAnimation);
              tile.parentElement.removeChild(bombElement);
            }
          }, bombAnimationInterval);

          // draw line from middle to top edge
          let topWallBlock = false;
          for (let i = 2; i <= bomb.bombLevel; i++) {
            let tile = getAllTiles[bomb.coordCalculation - 15 * (i - 1)];
            if (tile) {
              let player = document.querySelector(`.${playerTag}`)
              let imgContainer = tile.parentElement;
              let checkForWall = imgContainer.querySelector('.destroyableWall');
              let indestructibleWall = imgContainer.querySelector(
                '.indestructibleWall'
              );
              let x = imgContainer.offsetLeft / 50;
              let y = imgContainer.offsetTop / 50;
              let expImg = checkForWall ? 6 : 4;

              if (!tile.hasAttribute('indestructible')) {
                let exp = NewElement('img', 'explosion');
                exp.src = ExplosionStage1[expImg];
                imgContainer.appendChild(exp);
                player && collusion(player, imgContainer)
                let explosionIndex = 0;
                const explosionAnimation = setInterval(() => {
                  player && collusion(player, imgContainer)
                  exp.src = explosionArray[explosionIndex][expImg];
                  explosionIndex++;
                  if (explosionIndex == 5) {
                    clearInterval(explosionAnimation);
                    imgContainer.removeChild(exp);
                    if (checkForWall) {
                      imgContainer.removeChild(checkForWall);
                      grid[x][y].WallType = 0;
                    }
                  }
                }, bombAnimationInterval);
              }
              if (indestructibleWall || checkForWall) {
                topWallBlock = true;
                break;
              }
            }
          }
          // draw top bomb edge
          if (topWallBlock == false) {
            let tile = getAllTiles[bomb.coordCalculation - bomb.bombLevel * 15];
            if (tile) {
              let player = document.querySelector(`.${playerTag}`)
              let imgContainer = tile.parentElement;
              let x = imgContainer.offsetLeft / 50;
              let y = imgContainer.offsetTop / 50;
              if (!tile.hasAttribute('indestructible')) {
                let exp = NewElement('img', 'explosion');
                exp.src = ExplosionStage1[6];
                imgContainer.appendChild(exp);
                player && collusion(player, imgContainer)
                let explosionIndex = 0;
                const explosionAnimation = setInterval(() => {
                  player && collusion(player, imgContainer)
                  exp.src = explosionArray[explosionIndex][6];
                  explosionIndex++;
                  if (explosionIndex == 5) {
                    clearInterval(explosionAnimation);
                    imgContainer.removeChild(exp);
                    let checkForWall =
                      imgContainer.querySelector('.destroyableWall');
                    if (checkForWall) {
                      imgContainer.removeChild(checkForWall);
                      grid[x][y].WallType = 0;
                    }
                  }
                }, bombAnimationInterval);
              }
            }
          }
          // draw line from middle to left edge
          let leftWallBlock = false;
          for (let i = 1; i <= bomb.bombLevel - 1; i++) {
            let tile = getAllTiles[bomb.coordCalculation - i * 1];
            if (tile) {
              let player = document.querySelector(`.${playerTag}`)
              let imgContainer = tile.parentElement;
              let checkForWall = imgContainer.querySelector('.destroyableWall');
              let indestructibleWall = imgContainer.querySelector(
                '.indestructibleWall'
              );
              let x = imgContainer.offsetLeft / 50;
              let y = imgContainer.offsetTop / 50;
              let expImg = checkForWall ? 2 : 3;

              if (!tile.hasAttribute('indestructible')) {
                let exp = NewElement('img', 'explosion');
                exp.src = ExplosionStage1[expImg];
                imgContainer.appendChild(exp);
                player && collusion(player, imgContainer)
                let explosionIndex = 0;
                const explosionAnimation = setInterval(() => {
                  player && collusion(player, imgContainer)
                  exp.src = explosionArray[explosionIndex][expImg];
                  explosionIndex++;
                  if (explosionIndex == 5) {
                    clearInterval(explosionAnimation);
                    imgContainer.removeChild(exp);
                    if (checkForWall) {
                      imgContainer.removeChild(checkForWall);
                      grid[x][y].WallType = 0;
                    }
                  }
                }, bombAnimationInterval);
              }

              if (indestructibleWall || checkForWall) {
                leftWallBlock = true;
                break;
              }
            }
          }
          // draw bomb left edge
          if (leftWallBlock == false) {
            let tile = getAllTiles[bomb.coordCalculation - bomb.bombLevel * 1];
            if (tile) {
              let player = document.querySelector(`.${playerTag}`)
              let imgContainer = tile.parentElement;
              let x = imgContainer.offsetLeft / 50;
              let y = imgContainer.offsetTop / 50;

              if (!tile.hasAttribute('indestructible')) {
                let exp = NewElement('img', 'explosion');
                exp.src = ExplosionStage1[2];
                imgContainer.appendChild(exp);
                player && collusion(player, imgContainer)
                let explosionIndex = 0;
                const explosionAnimation = setInterval(() => {
                  player && collusion(player, imgContainer)
                  exp.src = explosionArray[explosionIndex][2];  
                  explosionIndex++;
                  if (explosionIndex == 5) {
                    clearInterval(explosionAnimation);
                    imgContainer.removeChild(exp);
                    let checkForWall =
                      imgContainer.querySelector('.destroyableWall');
                    if (checkForWall) {
                      imgContainer.removeChild(checkForWall);
                      grid[x][y].WallType = 0;
                    }
                  }
                }, bombAnimationInterval);
              }
            }
          }
          // draw line from middle to right edge
          let rightWallBlock = false;
          for (let i = 1; i <= bomb.bombLevel - 1; i++) {
            let tile = getAllTiles[bomb.coordCalculation + i];
            if (tile) {
              let player = document.querySelector(`.${playerTag}`)
              let imgContainer = tile.parentElement;
              let checkForWall = imgContainer.querySelector('.destroyableWall');
              let indestructibleWall = imgContainer.querySelector(
                '.indestructibleWall'
              );
              let x = imgContainer.offsetLeft / 50;
              let y = imgContainer.offsetTop / 50;
              let expImg = checkForWall ? 5 : 3;

              if (!tile.hasAttribute('indestructible')) {
                let exp = NewElement('img', 'explosion');
                exp.src = ExplosionStage1[expImg];
                imgContainer.appendChild(exp);
                player && collusion(player, imgContainer)
                let explosionIndex = 0;
                const explosionAnimation = setInterval(() => {
                  player && collusion(player, imgContainer)
                  exp.src = explosionArray[explosionIndex][expImg];
                  explosionIndex++;
                  if (explosionIndex == 5) {
                    clearInterval(explosionAnimation);
                    imgContainer.removeChild(exp);
                    if (checkForWall) {
                      imgContainer.removeChild(checkForWall);
                      grid[x][y].WallType = 0;
                    }
                  }
                }, bombAnimationInterval);
              }

              if (indestructibleWall || checkForWall) {
                rightWallBlock = true;
                break;
              }
            }
          }
          // draw bomb right edge
          if (rightWallBlock == false) {
            let tile = getAllTiles[bomb.coordCalculation + bomb.bombLevel * 1];
            if (tile) {
              let player = document.querySelector(`.${playerTag}`)
              let imgContainer = tile.parentElement;
              let x = imgContainer.offsetLeft / 50;
              let y = imgContainer.offsetTop / 50;
              if (!tile.hasAttribute('indestructible')) {
                let exp = NewElement('img', 'explosion');
                exp.src = ExplosionStage1[5];
                imgContainer.appendChild(exp);
                player && collusion(player, imgContainer)
                let explosionIndex = 0;
                const explosionAnimation = setInterval(() => {
                  player && collusion(player, imgContainer)
                  exp.src = explosionArray[explosionIndex][5];
                  explosionIndex++;
                  if (explosionIndex == 5) {
                    clearInterval(explosionAnimation);
                    imgContainer.removeChild(exp);
                    let checkForWall =
                      imgContainer.querySelector('.destroyableWall');
                    if (checkForWall) {
                      imgContainer.removeChild(checkForWall);
                      grid[x][y].WallType = 0;
                    }
                  }
                }, bombAnimationInterval);
              }
            }
          }
          // draw line from middle to bottom edge
          let bottomWallBlock = false;
          for (let i = 2; i <= bomb.bombLevel; i++) {
            let tile = getAllTiles[bomb.coordCalculation + 15 * (i - 1)];
            if (tile) {
              let player = document.querySelector(`.${playerTag}`)
              let imgContainer = tile.parentElement;
              let checkForWall = imgContainer.querySelector('.destroyableWall');
              let indestructibleWall = imgContainer.querySelector(
                '.indestructibleWall'
              );
              let x = imgContainer.offsetLeft / 50;
              let y = imgContainer.offsetTop / 50;
              let expImg = checkForWall ? 0 : 4;

              if (!tile.hasAttribute('indestructible')) {
                let exp = NewElement('img', 'explosion');
                exp.src = ExplosionStage1[expImg];
                imgContainer.appendChild(exp);
                player && collusion(player, imgContainer)
                let explosionIndex = 0;
                const explosionAnimation = setInterval(() => {
                  player && collusion(player, imgContainer)
                  exp.src = explosionArray[explosionIndex][expImg];
                  explosionIndex++;
                  if (explosionIndex == 5) {
                    clearInterval(explosionAnimation);
                    imgContainer.removeChild(exp);
                    if (checkForWall) {
                      imgContainer.removeChild(checkForWall);
                      grid[x][y].WallType = 0;
                    }
                  }
                }, bombAnimationInterval);
              }

              if (indestructibleWall || checkForWall) {
                bottomWallBlock = true;
                break;
              }
            }
          }
          // draw bomb bottom edge
          if (bottomWallBlock == false) {
            let tile = getAllTiles[bomb.coordCalculation + bomb.bombLevel * 15];
            if (tile) {
              let player = document.querySelector(`.${playerTag}`)
              let imgContainer = tile.parentElement;
              let x = imgContainer.offsetLeft / 50;
              let y = imgContainer.offsetTop / 50;
              if (!tile.hasAttribute('indestructible')) {
                let exp = NewElement('img', 'explosion');
                exp.src = ExplosionStage1[0];
                imgContainer.appendChild(exp);
                player && collusion(player, imgContainer)
                let explosionIndex = 0;
                const explosionAnimation = setInterval(() => {
                  player && collusion(player, imgContainer)
                  exp.src = explosionArray[explosionIndex][0];
                  explosionIndex++;
                  if (explosionIndex == 5) {
                    clearInterval(explosionAnimation);
                    imgContainer.removeChild(exp);
                    let checkForWall =
                      imgContainer.querySelector('.destroyableWall');
                    if (checkForWall) {
                      imgContainer.removeChild(checkForWall);
                      grid[x][y].WallType = 0;
                    }
                  }
                }, bombAnimationInterval);
              }
            }
          }
        }
      }
    }
  });
};

export const removePowerUp = (powerUp, grid) => {
  let powerUps = document.querySelectorAll(`.powerUp${powerUp.nr}`);

  powerUps.forEach((power) => {
    if (
      power.offsetParent.offsetTop / 50 == powerUp.coordY &&
      power.offsetParent.offsetLeft / 50 == powerUp.coordX
    ) {
      power.remove();
      grid[powerUp.coordX][powerUp.coordY].PowerUp = 0;
    }
  });
};

export const initBomberman = (
  grid,
  gameTag,
  group,
  sendJsonMessage,
  playersRef,
  currentUser,
  bombs
) => {
  Point('bomberman-root').appendChild(GenerateGrid(grid));
  json = sendJsonMessage
  playerTag = gameTag
  groupId = group

  // Current FPS
  const FPS = Point('gameContainer')[0].parentElement.appendChild(
    NewElement('p', 'fps')
  );

  // Max FPS
  const MaxFPS = Point('gameContainer')[0].parentElement.appendChild(
    NewElement('p', 'maxFps')
  );

  if (playerLives.get(gameTag) == 0) {
      playersRef = null
  }
  playersRef.current = {};

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
        bombPlaced = true
        break;
    }
  };

  if (group.length > 0) {
    // player1
    const player1 = Point('gameContainer')[0].appendChild(
      NewElement('img', 'player1'),
    );
    player1.setAttribute("player", "player1")
    let player1XCoord = 50;
    let player1YCoord = 50;
    player1.src = player1FrontStyle;
    player1.style.left = player1XCoord + 'px';
    player1.style.top = player1YCoord + 'px';
    playersRef.current['player1'] = {
      element: player1,
      x: player1XCoord,
      y: player1YCoord,
    };
  }

  if (group.length > 1) {
    // player2
    const player2 = Point('gameContainer')[0].appendChild(
      NewElement('img', 'player2')
    );
    player2.setAttribute("player", "player2")
    let player2XCoord = 650;
    let player2YCoord = 50;
    player2.src = player2FrontStyle;
    player2.style.left = player2XCoord + 'px';
    player2.style.top = player2YCoord + 'px';
    playersRef.current['player2'] = {
      element: player2,
      x: player2XCoord,
      y: player2YCoord,
    };
  }

  if (group.length > 2) {
    // player3
    const player3 = Point('gameContainer')[0].appendChild(
      NewElement('img', 'player3')
    );
    player3.setAttribute("player", "player3")
    let player3XCoord = 50;
    let player3YCoord = 550;
    player3.src = player3FrontStyle;
    player3.style.left = player3XCoord + 'px';
    player3.style.top = player3YCoord + 'px';
    playersRef.current['player3'] = {
      element: player3,
      x: player3XCoord,
      y: player3YCoord,
    };
  }

  if (group.length > 3) {
    // player4
    const player4 = Point('gameContainer')[0].appendChild(
      NewElement('img', 'player4')
    );
    player4.setAttribute("player", "player4")
    let player4XCoord = 650;
    let player4YCoord = 550;
    player4.src = player4FrontStyle;
    player4.style.left = player4XCoord + 'px';
    player4.style.top = player4YCoord + 'px';
    playersRef.current['player4'] = {
      element: player4,
      x: player4XCoord,
      y: player4YCoord,
    };
  }

  //animation
  const refresh = (timestamp) => {
    //limit fps to 60
    const deltaTime = timestamp - lastTimestamp;

    // count max FPS
    maxFrameCount++;
    if (timestamp - lastSecondTimestamp >= 1000) {
      MaxFPS.textContent = maxFrameCount + ': Max FPS';
      maxFrameCount = 0;
      lastSecondTimestamp = timestamp;
    }

    // limit framerate
    if (deltaTime < minFrameTime) {
      requestAnimationFrame(refresh);
      return;
    }
    // count actual FPS
    frameCount++;
    if (timestamp - lastSecondTimestampForMax >= 1000) {
      FPS.textContent = frameCount + ': Current FPS';
      frameCount = 0;
      lastSecondTimestampForMax = timestamp;
    }

    // character movements
    if (!playerLives.get(gameTag).dead) {
    switch (moveDirection) {
      case 'up':
        {
          const checkFutureY = playersRef.current[gameTag].y - playerSpeed;
          const checkFutureX = playersRef.current[gameTag].x;
          console.log(playerLives);
          let wall =
            grid[Math.ceil(checkFutureX / 50)][Math.ceil(checkFutureY / 50) - 1]
              .WallType;
          let powerUpNr =
            grid[Math.ceil(checkFutureX / 50)][Math.ceil(checkFutureY / 50) - 1]
              .PowerUp;

          if (
            (checkFutureY > 50 &&
              Math.round(checkFutureX / 50) % 2 == 1 &&
              checkFutureX % 50 >= 0 &&
              checkFutureX % 50 < tolerance) ||
            (checkFutureY > 50 &&
              Math.round(checkFutureX / 50) % 2 == 1 &&
              checkFutureX % 50 >= 0 &&
              checkFutureX % 50 > 50 - tolerance)
          ) {
            if (checkFutureX % 50 > 50 - tolerance) {
              playersRef.current[gameTag].x += 1;
            } else if (checkFutureX % 50 > 0) {
              playersRef.current[gameTag].x -= 4;
            }
            if (wall != 1) {
              playersRef.current[gameTag].y = checkFutureY;
              if (powerUpNr > 0 && powerUpNr < 4) {
                const powerUp = {
                  nr: powerUpNr,
                  coordX: Math.ceil(checkFutureX / 50),
                  coordY: Math.ceil(checkFutureY / 50) - 1,
                };
                sendJsonMessage({
                  type: 'removePwrUp',
                  removePwrUp: powerUp,
                  fromuserid: currentUser,
                  gameTag: gameTag,
                  gameGroup: group,
                });

                powerUp.nr == 1 && (maxBombs += 1);
                powerUp.nr == 2 && (bombActiveLevel += 1);
                powerUp.nr == 3 && (playerSpeed = 3);
              }
            }
          }
        }
        break;
      case 'down':
        {
          const checkFutureY = playersRef.current[gameTag].y + playerSpeed;
          const checkFutureX = playersRef.current[gameTag].x;

          let wall =
            grid[Math.ceil(checkFutureX / 50)][Math.ceil(checkFutureY / 50)]
              .WallType;
          let powerUpNr =
            grid[Math.ceil(checkFutureX / 50)][Math.ceil(checkFutureY / 50)]
              .PowerUp;

          if (
            (checkFutureY < 550 &&
              Math.round(checkFutureX / 50) % 2 == 1 &&
              checkFutureX % 50 >= 0 &&
              checkFutureX % 50 < tolerance) ||
            (checkFutureY < 550 &&
              Math.round(checkFutureX / 50) % 2 == 1 &&
              checkFutureX % 50 >= 0 &&
              checkFutureX % 50 > 50 - tolerance)
          ) {
            if (checkFutureX % 50 > 50 - tolerance) {
              playersRef.current[gameTag].x += 1;
            } else if (checkFutureX % 50 > 0) {
              playersRef.current[gameTag].x -= 4;
            }
            if (wall != 1) {
              playersRef.current[gameTag].y = checkFutureY;
              if (powerUpNr > 0 && powerUpNr < 4) {
                const powerUp = {
                  nr: powerUpNr,
                  coordX: Math.ceil(checkFutureX / 50),
                  coordY: Math.ceil(checkFutureY / 50),
                };
                sendJsonMessage({
                  type: 'removePwrUp',
                  removePwrUp: powerUp,
                  fromuserid: currentUser,
                  gameTag: gameTag,
                  gameGroup: group,
                });
                powerUp.nr == 1 && (maxBombs += 1);
                powerUp.nr == 2 && (bombActiveLevel += 1);
                powerUp.nr == 3 && (playerSpeed = 3);
              }
            }
          }
        }
        break;
      case 'left':
        {
          const checkFutureX = playersRef.current[gameTag].x - playerSpeed;
          const checkFutureY = playersRef.current[gameTag].y;

          let powerUpNr =
            grid[Math.ceil(checkFutureX / 50) - 1][Math.ceil(checkFutureY / 50)]
              .PowerUp;
          let wall =
            grid[Math.ceil(checkFutureX / 50) - 1][Math.ceil(checkFutureY / 50)]
              .WallType;

          if (
            (checkFutureX > 50 &&
              Math.round(checkFutureY / 50) % 2 == 1 &&
              checkFutureY % 50 >= 0 &&
              checkFutureY % 50 < tolerance) ||
            (checkFutureX > 50 &&
              Math.round(checkFutureY / 50) % 2 == 1 &&
              checkFutureY % 50 >= 0 &&
              checkFutureY % 50 > 50 - tolerance)
          ) {
            if (checkFutureY % 50 > 50 - tolerance) {
              playersRef.current[gameTag].y += 1;
            } else if (checkFutureY % 50 > 0) {
              playersRef.current[gameTag].y -= 4;
            }
            if (wall != 1) {
              playersRef.current[gameTag].x = checkFutureX;
              if (powerUpNr > 0 && powerUpNr < 4) {
                const powerUp = {
                  nr: powerUpNr,
                  coordX: Math.ceil(checkFutureX / 50) - 1,
                  coordY: Math.ceil(checkFutureY / 50),
                };
                sendJsonMessage({
                  type: 'removePwrUp',
                  removePwrUp: powerUp,
                  fromuserid: currentUser,
                  gameTag: gameTag,
                  gameGroup: group,
                });
                powerUp.nr == 1 && (maxBombs += 1);
                powerUp.nr == 2 && (bombActiveLevel += 1);
                powerUp.nr == 3 && (playerSpeed = 3);
              }
            }
          }
        }
        break;
      case 'right':
        {
          const checkFutureX = playersRef.current[gameTag].x + playerSpeed;
          var checkFutureY = playersRef.current[gameTag].y;

          let wall =
            grid[Math.ceil(checkFutureX / 50)][Math.ceil(checkFutureY / 50)]
              .WallType;
          let powerUpNr =
            grid[Math.ceil(checkFutureX / 50)][Math.ceil(checkFutureY / 50)]
              .PowerUp;

          if (
            (checkFutureX < 650 &&
              Math.round(checkFutureY / 50) % 2 == 1 &&
              checkFutureY % 50 >= 0 &&
              checkFutureY % 50 < tolerance) ||
            (checkFutureX < 650 &&
              Math.round(checkFutureY / 50) % 2 == 1 &&
              checkFutureY % 50 >= 0 &&
              checkFutureY % 50 > 50 - tolerance)
          ) {
            if (checkFutureY % 50 > 50 - tolerance) {
              playersRef.current[gameTag].y += 1;
            } else if (checkFutureY % 50 > 0) {
              playersRef.current[gameTag].y -= 4;
            }
            if (wall != 1) {
              playersRef.current[gameTag].x = checkFutureX;

              if (powerUpNr > 0 && powerUpNr < 4) {
                const powerUp = {
                  nr: powerUpNr,
                  coordX: Math.ceil(checkFutureX / 50),
                  coordY: Math.ceil(checkFutureY / 50),
                };
                sendJsonMessage({
                  type: 'removePwrUp',
                  removePwrUp: powerUp,
                  fromuserid: currentUser,
                  gameTag: gameTag,
                  gameGroup: group,
                });
                powerUp.nr == 1 && (maxBombs += 1);
                powerUp.nr == 2 && (bombActiveLevel += 1);
                powerUp.nr == 3 && (playerSpeed = 3);
              }
            }
          }
        }
        break;
      }
    }

    if (playerLives.get(gameTag).dead == false) {
      updatePlayerPosition(
        playersRef.current[gameTag].element,
        playersRef.current[gameTag].x,
        playersRef.current[gameTag].y
      );
    }

      if (playerLives.get(gameTag).dead == true) {
        updatePlayerPosition(
          playersRef.current[gameTag].element,
          playersRef.current[gameTag].x = playerLives.get(gameTag).spawnX,
          playersRef.current[gameTag].y = playerLives.get(gameTag).spawnY
        );
      }

    if (bombPlaced && !playerLives.get(gameTag).dead) {
      userPlacedBomb(
        playersRef.current[gameTag].x,
        playersRef.current[gameTag].y
      );
    }
    
    updateBombPosition(bombs);
    // limited tick speed 12 ticks / 5/s
    if (tick >= tickSpeed) {
      sendJsonMessage({
        type: 'bombermanCoords',
        fromuserid: currentUser,
        gameTag: gameTag,
        gameGroup: group,
        coordX: playersRef.current[gameTag].x.toString(),
        coordY: playersRef.current[gameTag].y.toString(),
        bombs: bombs
      });
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
