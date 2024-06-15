import { NewElement } from '../../../../../mini-framework/index.js';

import Player1moveL6 from './assets/characters/blue/moveL6.png';
import Player1moveL5 from './assets/characters/blue/moveL5.png';
import Player1moveL4 from './assets/characters/blue/moveL4.png';
import Player1moveL3 from './assets/characters/blue/moveL3.png';
import Player1moveL2 from './assets/characters/blue/moveL2.png';
import Player1moveL1 from './assets/characters/blue/moveL1.png';

import Player1moveR1 from './assets/characters/blue/moveR1.png';
import Player1moveR2 from './assets/characters/blue/moveR2.png';
import Player1moveR3 from './assets/characters/blue/moveR3.png';
import Player1moveR4 from './assets/characters/blue/moveR4.png';
import Player1moveR5 from './assets/characters/blue/moveR5.png';
import Player1moveR6 from './assets/characters/blue/moveR6.png';

import Player2moveL6 from './assets/characters/green/moveL6.png';
import Player2moveL5 from './assets/characters/green/moveL5.png';
import Player2moveL4 from './assets/characters/green/moveL4.png';
import Player2moveL3 from './assets/characters/green/moveL3.png';
import Player2moveL2 from './assets/characters/green/moveL2.png';
import Player2moveL1 from './assets/characters/green/moveL1.png';

import Player2moveR1 from './assets/characters/green/moveR1.png';
import Player2moveR2 from './assets/characters/green/moveR2.png';
import Player2moveR3 from './assets/characters/green/moveR3.png';
import Player2moveR4 from './assets/characters/green/moveR4.png';
import Player2moveR5 from './assets/characters/green/moveR5.png';
import Player2moveR6 from './assets/characters/green/moveR6.png';

export const GenerateGrid = (grid) => {
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

export const Player1MoveLeft = [
  Player1moveL6,
  Player1moveL5,
  Player1moveL4,
  Player1moveL3,
  Player1moveL2,
  Player1moveL1,
];
export const Player1MoveRight = [
  Player1moveR1,
  Player1moveR2,
  Player1moveR3,
  Player1moveR4,
  Player1moveR5,
  Player1moveR6,
];

export const Player2MoveLeft = [
  Player2moveL6,
  Player2moveL5,
  Player2moveL4,
  Player2moveL3,
  Player2moveL2,
  Player2moveL1,
];
export const Player2MoveRight = [
  Player2moveR1,
  Player2moveR2,
  Player2moveR3,
  Player2moveR4,
  Player2moveR5,
  Player2moveR6,
];
