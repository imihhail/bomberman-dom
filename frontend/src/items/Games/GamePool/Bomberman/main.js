console.log('Conneted!');
import './bobermanMain.css';

export const generateGrid = (grid) => {
  const gameGrid = document.createElement('div');
  for (let y = 0; y < 13; y++) {
    const row = document.createElement('div');
    row.classList.add('map-row');
    for (let x = 0; x < 15; x++) {
      const column = document.createElement('div');
      column.classList.add('square');
      if (grid[x][y].WallType == 9 ) {
        column.classList.add('indestructible-wall');
        column.setAttribute('indestructible', 'indestructible')
      } else if (grid[x][y].WallType == 1) {
        column.classList.add('walk-tile');
        column.classList.add('destroyable-wall');
      } else {
        column.classList.add('walk-tile');
      }
      row.appendChild(column);
    }
    gameGrid.appendChild(row);
  }
  return gameGrid;
};

export const movePlayer = (currentUser, newLocation) => {
  const previousLocation = document.querySelector(`.player${currentUser}`)
  const getAllTiles = document.querySelectorAll('.square');

  previousLocation.classList.remove(`player${currentUser}`);
  getAllTiles[newLocation].classList.add(`player${currentUser}`);
}

export const initBomberman = (players, currentUser, setPlayerPos) => {
  const getAllTiles = document.querySelectorAll('.square');
  getAllTiles[players.player1].classList.add('player1');
  getAllTiles[players.player2].classList.add('player2');
  getAllTiles[players.player3].classList.add('player3');
  getAllTiles[players.player4].classList.add('player4');
  
  let playerPos = players[`player${currentUser}`];

    window.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'ArrowUp':
          let newPositionUp = getAllTiles[playerPos - 15]
          if (!newPositionUp.hasAttribute('indestructible') && !newPositionUp.classList.contains('destroyable-wall')) {
            playerPos = playerPos - 15;
            setPlayerPos(playerPos);
          }
        break;
      case 'ArrowDown':
          let newPositionDown = getAllTiles[playerPos + 15]
          if (!newPositionDown.hasAttribute('indestructible') && !newPositionDown.classList.contains('destroyable-wall')) {
            playerPos = playerPos + 15;
            setPlayerPos(playerPos);
          }
        break;
      case 'ArrowLeft':
          let newPositionLeft = getAllTiles[playerPos - 1]
          if (!newPositionLeft.hasAttribute('indestructible') && !newPositionLeft.classList.contains('destroyable-wall')) {
            playerPos = playerPos - 1;
            setPlayerPos(playerPos);
          }
        break;
      case 'ArrowRight':
          let newPositionRight = getAllTiles[playerPos + 1]
          if (!newPositionRight.hasAttribute('indestructible') && !newPositionRight.classList.contains('destroyable-wall')) {
            playerPos = playerPos + 1;
            setPlayerPos(playerPos);
          }
        break;
        case 'Space':
          bombCoordinate(playerPos, 2);
          break;
      }
    });
};

const bombCoordinate = (coord, bombLevel) => {
  const getAllTiles = document.querySelectorAll('.square')
  let coordCalculation = coord;
  getAllTiles[coordCalculation].classList.add('bomb')

  
  setTimeout(() => {
    getAllTiles[coordCalculation].classList.add('innerExplosion')

    // draw line from middle to edge
    let topWallBlock = false
    for (let i = 2; i <= bombLevel; i++) {
      var tile = getAllTiles[coordCalculation - 15 * (i-1)]
      if (tile) {
        if (!tile.hasAttribute('indestructible') && !tile.classList.contains('destroyable-wall')) {
          tile.classList.add('bomb-pipe')
        }
        if (tile.hasAttribute('indestructible')) {
          topWallBlock = true
          break
        }
        if (tile.classList.contains('destroyable-wall')) {
          tile.classList.add('bomb-top-edge')
          tile.classList.remove('destroyable-wall')
          topWallBlock = true
          break
        }
      }
    }
  
  // draw top bomb edge
  if (topWallBlock == false) {
    var tile = getAllTiles[coordCalculation - bombLevel * 15]
    if (tile) {
      if (!tile.hasAttribute('indestructible')) {
        tile.classList.add('bomb-top-edge')
      }
      if (tile.classList.contains('destroyable-wall')) {
        tile.classList.remove('destroyable-wall')
      }
    }
  }

  // draw line from middle to edge
  let leftWallBlock = false
  for (let i = 1; i <= bombLevel - 1; i++) {
    var tile = getAllTiles[coordCalculation - i * 1]
    if (tile) {
      if (!tile.hasAttribute('indestructible') && !tile.classList.contains('destroyable-wall')) {
        tile.classList.add('bomb-line')
      }
      if (tile.hasAttribute('indestructible')) {
        leftWallBlock = true
        break
      }
      if (tile.classList.contains('destroyable-wall')) {
        tile.classList.add('bomb-left-edge')
        tile.classList.remove('destroyable-wall')
        leftWallBlock = true
        break
      }
    }
  }

  // draw bomb left edge
  if (leftWallBlock == false) {
    var tile = getAllTiles[coordCalculation - bombLevel * 1]
    if (tile) {
      if (!tile.hasAttribute('indestructible')) {
        tile.classList.add('bomb-left-edge')
      }
      if (tile.classList.contains('destroyable-wall')) {
        tile.classList.remove('destroyable-wall')
      }
    }
  }

  // draw line from middle to edge
  let rightWallBlock = false
  for (let i = 1; i <= bombLevel - 1; i++) {
    let tile = getAllTiles[coordCalculation + i * 1]
     if (tile) {
      if (!tile.hasAttribute('indestructible') && !tile.classList.contains('destroyable-wall')) {
        tile.classList.add('bomb-line')
      }
      if (tile.hasAttribute('indestructible')) {
        rightWallBlock = true
        break
      }
      if (tile.classList.contains('destroyable-wall')) {
        tile.classList.add('bomb-right-edge')
        tile.classList.remove('destroyable-wall')
        rightWallBlock = true
        break
      }
    }
  }

  // draw bomb right edge
  if (rightWallBlock == false) {
    var tile = getAllTiles[coordCalculation + bombLevel * 1]
    if (tile) {
      if (!tile.hasAttribute('indestructible')) {
        tile.classList.add('bomb-right-edge')
      }
      if (tile.classList.contains('destroyable-wall')) {
        tile.classList.remove('destroyable-wall')
      }
    }
  }

  // draw line from middle to edge
  let bottomWallBlock = false
  for (let i = 2; i <= bombLevel; i++) {
    let tile = getAllTiles[coordCalculation + 15 * (i-1)]
    if (tile) {
      if (!tile.hasAttribute('indestructible') && !tile.classList.contains('destroyable-wall')) {
        tile.classList.add('bomb-pipe')
      }
      if (tile.hasAttribute('indestructible')) {
        bottomWallBlock = true
        break
      }
      if (tile.classList.contains('destroyable-wall')) {
        tile.classList.add('bomb-bottom-edge')
        tile.classList.remove('destroyable-wall')
        bottomWallBlock = true
        break
      }
    }
  }

  // draw bomb bottom edge
  if (bottomWallBlock == false) {
    var tile = getAllTiles[coordCalculation + bombLevel * 15]
    if (tile) {
      if (!tile.hasAttribute('indestructible')) {
        tile.classList.add('bomb-bottom-edge')
      }
      if (tile.classList.contains('destroyable-wall')) {
        tile.classList.remove('destroyable-wall')
      }
    }
  }

  }, 1000)

  setTimeout(() => {
    document.querySelectorAll('.bomb, .bomb-pipe, .bomb-line, .bomb-top-edge, .bomb-left-edge, .bomb-right-edge, .bomb-bottom-edge, .innerExplosion').forEach(tile => {
      tile.classList.remove('bomb', 'bomb-pipe', 'bomb-line', 'bomb-top-edge', 'bomb-left-edge', 'bomb-right-edge', 'bomb-bottom-edge', 'innerExplosion');
    });
  }, 2000);
};

// initBomberman(31);
