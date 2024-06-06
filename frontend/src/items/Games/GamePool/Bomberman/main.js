console.log('Conneted!');
import './bobermanMain.css';

export const initBomberman = () => {
  const root = document.querySelector('#bomberman-root');
  root.appendChild(generateGrid());
  const getAllTiles = document.querySelectorAll('.square');
  let playerPos = 31;
  getAllTiles[playerPos].classList.add('player1');
  window.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'ArrowUp':
        if (playerPos > 60) {
          getAllTiles[playerPos].classList.remove('player1');
          playerPos = playerPos - 30;
          getAllTiles[playerPos].classList.add('player1');
        }
        break;
      case 'ArrowDown':
        if (playerPos < 539) {
          getAllTiles[playerPos].classList.remove('player1');
          playerPos = playerPos + 30;
          getAllTiles[playerPos].classList.add('player1');
        }
        break;
      case 'ArrowLeft':
        if (playerPos % 30 > 1) {
          getAllTiles[playerPos].classList.remove('player1');
          playerPos = playerPos - 1;
          getAllTiles[playerPos].classList.add('player1');
        }
        break;
      case 'ArrowRight':
        if (playerPos % 30 < 28) {
          getAllTiles[playerPos].classList.remove('player1');
          playerPos = playerPos + 1;
          getAllTiles[playerPos].classList.add('player1');
        }
        break;
      case 'Space':
        bombCoordinate(playerPos, 2);
        setTimeout(() => {
          // removeBomb(playerPos, 1);
        });
        break;
    }
  });
};

const generateGrid = () => {
  const gameGrid = document.createElement('div');
  for (let i = 0; i < 20; i++) {
    const row = document.createElement('div');
    row.classList.add('map-row');
    for (let j = 0; j < 30; j++) {
      const column = document.createElement('div');
      column.classList.add('square');
      if (i == 0 || i == 19 || j == 0 || j == 29) {
        column.classList.add('indestructible-wall');
      } else {
        column.classList.add('walk-tile');
      }
      row.appendChild(column);
    }
    gameGrid.appendChild(row);
  }
  return gameGrid;
};

const bombCoordinate = (coord, bombLevel) => {
  const getAllTiles = document.querySelectorAll('.square');
  // let coordCalculation = 28 * (x - 1) - 1 + y;
  let coordCalculation = coord;
  getAllTiles[coordCalculation].classList.add('bomb');

  // draw line from middle to edge
  for (let i = 1; i <= bombLevel - 1; i++) {
    getAllTiles[coordCalculation - i * 28].classList.add('bomb-pipe');
  }

  // draw bomb edge
  if (coordCalculation - bombLevel * 28 > 0) {
    getAllTiles[coordCalculation - bombLevel * 30].classList.add(
      'bomb-top-edge'
    );
  }

  // draw line from middle to edge
  for (let i = 1; i <= bombLevel - 1; i++) {
    getAllTiles[coordCalculation - i * 1].classList.add('bomb-line');
  }

  // draw bomb left edge
  getAllTiles[coordCalculation - bombLevel * 1].classList.add('bomb-left-edge');

  // draw line from middle to edge
  for (let i = 1; i <= bombLevel - 1; i++) {
    getAllTiles[coordCalculation + i * 1].classList.add('bomb-line');
  }

  // draw bomb right edge
  getAllTiles[coordCalculation + bombLevel * 1].classList.add(
    'bomb-right-edge'
  );

  // draw line from middle to edge
  for (let i = 1; i <= bombLevel - 1; i++) {
    getAllTiles[coordCalculation + i * 28].classList.add('bomb-pipe');
  }

  // draw bomb bottom edge
  getAllTiles[coordCalculation + bombLevel * 30].classList.add(
    'bomb-bottom-edge'
  );
};
