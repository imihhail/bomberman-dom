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
  deathStages,
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
let bombAnimationInterval = 75;
let frameCount = 0;
let maxFrameCount = 0;
let lastSecondTimestamp = 0;
let lastSecondTimestampForMax = 0;
let tolerance = 15; // bigger number makes the walkpath wider
let lastTimestamp = performance.now();
const minFrameTime = 1000 / 60;
let moveDirection = null;
let json;
let groupId;
let playerTag;
let walking = false

class JsSQL {
  constructor(lives, dead, spawnX, spawnY, maxBombs, explosionPower) {
    this.lives = lives;
    this.dead = dead;
    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.maxBombs = maxBombs;
    this.explosionPower = explosionPower;
  }
}

let stats = new Map([
  ['player1', new JsSQL(3, false, 50, 50, 1, 1)],
  ['player2', new JsSQL(3, false, 650, 50, 1, 1)],
  ['player3', new JsSQL(3, false, 50, 550, 1, 1)],
  ['player4', new JsSQL(3, false, 650, 550, 1, 1)],
]);

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
    walking = false
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

const calculateBombPosition = (playerX, playerY) => {
  let plantedBombs = document.querySelectorAll(`[bomb="${playerTag}-bomb"]`);
  if (stats.get(playerTag).maxBombs <= plantedBombs.length) {
    return;
  }

  // Calculate which square div the bomb should be placed in
  let squareX = Math.floor((playerX + 25) / 50);
  let squareY = Math.floor((playerY + 25) / 50);
  let coordCalculation = squareY * 15 + squareX;

  let allBombs = Point('bomb');
  if (
    Array.from(allBombs).some(
      (bomb) => bomb.parentElement.id == `${squareX}${squareY}`
    )
  ) {
    return;
  }

  json({
    type: 'bombPlanted',
    bombs: `${squareX}${squareY}`,
    divIndex: coordCalculation,
    gameTag: playerTag,
    gameGroup: groupId,
  });
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
      bloodStainXY: element2.id.toString(),
      gameTag: playerTag,
      gameGroup: groupId,
    });
  }
};

export const death = (playerDied, bloodStainXY) => {
  const player = document.querySelector(`.${playerDied}`);
  const imgContainer = document.getElementById(bloodStainXY);
  if (player) {
    stats.get(playerDied).lives -= 1;
    Point('gameContainer')[0].removeChild(player);
    stats.get(playerDied).dead = true;
    walking = true
    let bloodStain = NewElement('img', 'bloodStain');
    bloodStain.src = deathStages[0];
    imgContainer.appendChild(bloodStain);
    let bloodIndex = 0;

    const bloodyAnimation = setInterval(() => {
      bloodStain.src = deathStages[bloodIndex];
      bloodIndex++;
      if (bloodIndex == 8) {
        clearInterval(bloodyAnimation);
        imgContainer.removeChild(bloodStain);
        if (stats.get(playerDied).lives != 0) {
          Point('gameContainer')[0].appendChild(player);
          stats.get(playerDied).dead = false;
          walking = false
        }
      }
    }, 100);
  }
};

export const updateBombPosition = (bombXY, bombLocation, grid, bombPlanter) => {
  const getAllTiles = Point('square');
  let bombPos = document.getElementById(bombXY);
  let bombElement = NewElement('img', 'bomb');
  bombElement.setAttribute('bomb', `${bombPlanter}-bomb`);
  bombElement.src = BombInit[0];
  bombPos.appendChild(bombElement);

  let player = document.querySelector(`.${playerTag}`);
  let tile = getAllTiles[bombLocation];
  let imgContainer = tile.parentElement;
  let bombIndex = 1;
  let bombInterval = 300;

  const updateBombAnimation = () => {
    bombElement.src = BombInit[bombIndex];
    bombIndex++;
    if (bombIndex == 9) {
      clearInterval(bombAnimation);
      bombInterval = 1000;
      bombAnimation = setInterval(updateBombAnimation, bombInterval);
    }
    if (bombIndex == 10) {
      clearInterval(bombAnimation);
      bombElement.remove();
      explosion();
    }
  };
  let bombAnimation = setInterval(updateBombAnimation, bombInterval);

  const explosion = () => {
    let exp = NewElement('img', 'explosion');
    exp.src = explosionArray[0][1];
    imgContainer.appendChild(exp);
    player && collusion(player, imgContainer);
    let explosionIndex = 1;
    const explosionAnimation = setInterval(() => {
      player && collusion(player, imgContainer);
      exp.src = explosionArray[explosionIndex][1];
      explosionIndex++;
      if (explosionIndex == 6) {
        clearInterval(explosionAnimation);
        imgContainer.removeChild(exp);
      }
    }, bombAnimationInterval);

    // draw line from middle to top edge
    let topWallBlock = false;
    for (let i = 2; i <= stats.get(bombPlanter).explosionPower; i++) {
      let tile = getAllTiles[bombLocation - 15 * (i - 1)];
      if (tile) {
        let player = document.querySelector(`.${playerTag}`);
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
          player && collusion(player, imgContainer);
          let explosionIndex = 1;
          const explosionAnimation = setInterval(() => {
            player && collusion(player, imgContainer);
            exp.src = explosionArray[explosionIndex][expImg];
            explosionIndex++;
            if (explosionIndex == 6) {
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
      let tile =
        getAllTiles[bombLocation - stats.get(bombPlanter).explosionPower * 15];
      if (tile) {
        let player = document.querySelector(`.${playerTag}`);
        let imgContainer = tile.parentElement;
        let x = imgContainer.offsetLeft / 50;
        let y = imgContainer.offsetTop / 50;
        if (!tile.hasAttribute('indestructible')) {
          let exp = NewElement('img', 'explosion');
          exp.src = ExplosionStage1[6];
          imgContainer.appendChild(exp);
          player && collusion(player, imgContainer);
          let explosionIndex = 1;
          const explosionAnimation = setInterval(() => {
            player && collusion(player, imgContainer);
            exp.src = explosionArray[explosionIndex][6];
            explosionIndex++;
            if (explosionIndex == 6) {
              clearInterval(explosionAnimation);
              imgContainer.removeChild(exp);
              let checkForWall = imgContainer.querySelector('.destroyableWall');
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
    for (let i = 1; i <= stats.get(bombPlanter).explosionPower - 1; i++) {
      let tile = getAllTiles[bombLocation - i * 1];
      if (tile) {
        let player = document.querySelector(`.${playerTag}`);
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
          player && collusion(player, imgContainer);
          let explosionIndex = 1;
          const explosionAnimation = setInterval(() => {
            player && collusion(player, imgContainer);
            exp.src = explosionArray[explosionIndex][expImg];
            explosionIndex++;
            if (explosionIndex == 6) {
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
      let tile =
        getAllTiles[bombLocation - stats.get(bombPlanter).explosionPower * 1];
      if (tile) {
        let player = document.querySelector(`.${playerTag}`);
        let imgContainer = tile.parentElement;
        let x = imgContainer.offsetLeft / 50;
        let y = imgContainer.offsetTop / 50;

        if (!tile.hasAttribute('indestructible')) {
          let exp = NewElement('img', 'explosion');
          exp.src = ExplosionStage1[2];
          imgContainer.appendChild(exp);
          player && collusion(player, imgContainer);
          let explosionIndex = 1;
          const explosionAnimation = setInterval(() => {
            player && collusion(player, imgContainer);
            exp.src = explosionArray[explosionIndex][2];
            explosionIndex++;
            if (explosionIndex == 6) {
              clearInterval(explosionAnimation);
              imgContainer.removeChild(exp);
              let checkForWall = imgContainer.querySelector('.destroyableWall');
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
    for (let i = 1; i <= stats.get(bombPlanter).explosionPower - 1; i++) {
      let tile = getAllTiles[bombLocation + i];
      if (tile) {
        let player = document.querySelector(`.${playerTag}`);
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
          player && collusion(player, imgContainer);
          let explosionIndex = 1;
          const explosionAnimation = setInterval(() => {
            player && collusion(player, imgContainer);
            exp.src = explosionArray[explosionIndex][expImg];
            explosionIndex++;
            if (explosionIndex == 6) {
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
      let tile =
        getAllTiles[bombLocation + stats.get(bombPlanter).explosionPower * 1];
      if (tile) {
        let player = document.querySelector(`.${playerTag}`);
        let imgContainer = tile.parentElement;
        let x = imgContainer.offsetLeft / 50;
        let y = imgContainer.offsetTop / 50;
        if (!tile.hasAttribute('indestructible')) {
          let exp = NewElement('img', 'explosion');
          exp.src = ExplosionStage1[5];
          imgContainer.appendChild(exp);
          player && collusion(player, imgContainer);
          let explosionIndex = 1;
          const explosionAnimation = setInterval(() => {
            player && collusion(player, imgContainer);
            exp.src = explosionArray[explosionIndex][5];
            explosionIndex++;
            if (explosionIndex == 6) {
              clearInterval(explosionAnimation);
              imgContainer.removeChild(exp);
              let checkForWall = imgContainer.querySelector('.destroyableWall');
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
    for (let i = 2; i <= stats.get(bombPlanter).explosionPower; i++) {
      let tile = getAllTiles[bombLocation + 15 * (i - 1)];
      if (tile) {
        let player = document.querySelector(`.${playerTag}`);
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
          player && collusion(player, imgContainer);
          let explosionIndex = 1;
          const explosionAnimation = setInterval(() => {
            player && collusion(player, imgContainer);
            exp.src = explosionArray[explosionIndex][expImg];
            explosionIndex++;
            if (explosionIndex == 6) {
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
      let tile =
        getAllTiles[bombLocation + stats.get(bombPlanter).explosionPower * 15];
      if (tile) {
        let player = document.querySelector(`.${playerTag}`);
        let imgContainer = tile.parentElement;
        let x = imgContainer.offsetLeft / 50;
        let y = imgContainer.offsetTop / 50;
        if (!tile.hasAttribute('indestructible')) {
          let exp = NewElement('img', 'explosion');
          exp.src = ExplosionStage1[0];
          imgContainer.appendChild(exp);
          player && collusion(player, imgContainer);
          let explosionIndex = 1;
          const explosionAnimation = setInterval(() => {
            player && collusion(player, imgContainer);
            exp.src = explosionArray[explosionIndex][0];
            explosionIndex++;
            if (explosionIndex == 6) {
              clearInterval(explosionAnimation);
              imgContainer.removeChild(exp);
              let checkForWall = imgContainer.querySelector('.destroyableWall');
              if (checkForWall) {
                imgContainer.removeChild(checkForWall);
                grid[x][y].WallType = 0;
              }
            }
          }, bombAnimationInterval);
        }
      }
    }
  };
};

export const removePowerUp = (powerUp, grid, gameTag) => {
  let powerUps = document.querySelectorAll(`.powerUp${powerUp.nr}`);

  powerUps.forEach((power) => {
    if (
      power.offsetParent.offsetTop / 50 == powerUp.coordY &&
      power.offsetParent.offsetLeft / 50 == powerUp.coordX
    ) {
      power.remove();
      grid[powerUp.coordX][powerUp.coordY].PowerUp = 0;
      if (powerUp.nr == 2) {
        stats.get(gameTag).explosionPower += 1;
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
  console.log("initBomberman");
  Point('bomberman-root').appendChild(GenerateGrid(grid));
  json = sendJsonMessage;
  playerTag = gameTag;
  groupId = group;

  // Current FPS
  const FPS = Point('gameContainer')[0].parentElement.appendChild(
    NewElement('p', 'fps')
  );

  // Max FPS
  const MaxFPS = Point('gameContainer')[0].parentElement.appendChild(
    NewElement('p', 'maxFps')
  );

  playersRef.current = {};

  const handleMovemement = (e) => {
    if (!stats.get(gameTag).dead) {
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
          calculateBombPosition(
            playersRef.current[playerTag].x,
            playersRef.current[playerTag].y
          );
          break;
      }
    }
  };

  if (group.length > 0) {
    // player1
    const player1 = Point('gameContainer')[0].appendChild(
      NewElement('img', 'player1')
    );
    player1.setAttribute('player', 'player1');
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
    player2.setAttribute('player', 'player2');
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
    player3.setAttribute('player', 'player3');
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
    player4.setAttribute('player', 'player4');
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
    // maxFrameCount++;
    // if (timestamp - lastSecondTimestamp >= 1000) {
    //   MaxFPS.textContent = maxFrameCount + ': Max FPS';
    //   maxFrameCount = 0;
    //   lastSecondTimestamp = timestamp;
    // }

    // limit framerate
    if (deltaTime >= minFrameTime) {
      lastTimestamp = timestamp;
      //count actual FPS
      //frameCount++;
      // if (timestamp - lastSecondTimestampForMax >= 1000) {
      //   FPS.textContent = frameCount + ': Current FPS';
      //   frameCount = 0;
      //   lastSecondTimestampForMax = timestamp;
      // }

      // character movements
      if (!stats.get(gameTag).dead) {
        switch (moveDirection) {
          case 'up':
            {
              const checkFutureY = playersRef.current[gameTag].y - playerSpeed;
              const checkFutureX = playersRef.current[gameTag].x;
              let wall =
                grid[Math.ceil(checkFutureX / 50)][
                  Math.ceil(checkFutureY / 50) - 1
                ].WallType;
              let powerUpNr =
                grid[Math.ceil(checkFutureX / 50)][
                  Math.ceil(checkFutureY / 50) - 1
                ].PowerUp;

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
                  walking = true
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

                    powerUp.nr == 1 && (stats.get(playerTag).maxBombs += 1);
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
                  walking = true
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
                    powerUp.nr == 1 && (stats.get(playerTag).maxBombs += 1);
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
                grid[Math.ceil(checkFutureX / 50) - 1][
                  Math.ceil(checkFutureY / 50)
                ].PowerUp;
              let wall =
                grid[Math.ceil(checkFutureX / 50) - 1][
                  Math.ceil(checkFutureY / 50)
                ].WallType;

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
                  walking = true
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
                    powerUp.nr == 1 && (stats.get(playerTag).maxBombs += 1);
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
                  walking = true
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
                    powerUp.nr == 1 && (stats.get(playerTag).maxBombs += 1);
                    powerUp.nr == 3 && (playerSpeed = 3);
                  }
                }
              }
            }
            break;
        }
      }
      
        if (stats.get(gameTag).dead == false && walking) {
          updatePlayerPosition(
            playersRef.current[gameTag].element,
            playersRef.current[gameTag].x,
            playersRef.current[gameTag].y
          );
        }

      if (stats.get(gameTag).dead == true) {
        //console.log("Deadass");
        updatePlayerPosition(
          playersRef.current[gameTag].element,
          (playersRef.current[gameTag].x = stats.get(gameTag).spawnX),
          (playersRef.current[gameTag].y = stats.get(gameTag).spawnY)
        );
      }
      // limited tick speed 12 ticks / 5/s
      if (walking){
        if (tick >= tickSpeed) {
        sendJsonMessage({
          type: 'bombermanCoords',
          fromuserid: currentUser,
          gameTag: gameTag,
          gameGroup: group,
          coordX: playersRef.current[gameTag].x,
          coordY: playersRef.current[gameTag].y,
        });
        tick = 0;
        }
      }
      tick++;
      lastTimestamp = timestamp;
    }
    requestAnimationFrame(refresh);
  };
  //keyboard
  window.addEventListener('keydown', handleMovemement);
  window.addEventListener('keyup', stopMovement);
  requestAnimationFrame(refresh);
};
