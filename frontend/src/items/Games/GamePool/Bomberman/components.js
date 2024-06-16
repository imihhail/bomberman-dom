import { NewElement } from '../../../../../mini-framework/index.js';

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

// player 1
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

import Player1moveBottom1 from './assets/characters/blue/frontM1.png';
import Player1moveBottom2 from './assets/characters/blue/frontM2.png';

import Player1moveTop1 from './assets/characters/blue/backM1.png';
import Player1moveTop2 from './assets/characters/blue/backM2.png';

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

export const Player1MoveTop = [
  Player1moveTop1,
  Player1moveTop1,
  Player1moveTop1,
  Player1moveTop2,
  Player1moveTop2,
  Player1moveTop2,
];

export const Player1MoveBottom = [
  Player1moveBottom1,
  Player1moveBottom1,
  Player1moveBottom1,
  Player1moveBottom2,
  Player1moveBottom2,
  Player1moveBottom2,
];

// player 2
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

import Player2moveBottom1 from './assets/characters/green/frontM1.png';
import Player2moveBottom2 from './assets/characters/green/frontM2.png';

import Player2moveTop1 from './assets/characters/green/backM1.png';
import Player2moveTop2 from './assets/characters/green/backM2.png';

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

export const Player2MoveTop = [
  Player2moveTop1,
  Player2moveTop1,
  Player2moveTop1,
  Player2moveTop2,
  Player2moveTop2,
  Player2moveTop2,
];

export const Player2MoveBottom = [
  Player2moveBottom1,
  Player2moveBottom1,
  Player2moveBottom1,
  Player2moveBottom2,
  Player2moveBottom2,
  Player2moveBottom2,
];

// player 3
import Player3moveL6 from './assets/characters/pink/moveL6.png';
import Player3moveL5 from './assets/characters/pink/moveL5.png';
import Player3moveL4 from './assets/characters/pink/moveL4.png';
import Player3moveL3 from './assets/characters/pink/moveL3.png';
import Player3moveL2 from './assets/characters/pink/moveL2.png';
import Player3moveL1 from './assets/characters/pink/moveL1.png';

import Player3moveR1 from './assets/characters/pink/moveR1.png';
import Player3moveR2 from './assets/characters/pink/moveR2.png';
import Player3moveR3 from './assets/characters/pink/moveR3.png';
import Player3moveR4 from './assets/characters/pink/moveR4.png';
import Player3moveR5 from './assets/characters/pink/moveR5.png';
import Player3moveR6 from './assets/characters/pink/moveR6.png';

import Player3moveBottom1 from './assets/characters/pink/frontM1.png';
import Player3moveBottom2 from './assets/characters/pink/frontM2.png';

import Player3moveTop1 from './assets/characters/pink/backM1.png';
import Player3moveTop2 from './assets/characters/pink/backM2.png';

export const Player3MoveLeft = [
  Player3moveL6,
  Player3moveL5,
  Player3moveL4,
  Player3moveL3,
  Player3moveL2,
  Player3moveL1,
];
export const Player3MoveRight = [
  Player3moveR1,
  Player3moveR2,
  Player3moveR3,
  Player3moveR4,
  Player3moveR5,
  Player3moveR6,
];

export const Player3MoveTop = [
  Player3moveTop1,
  Player3moveTop1,
  Player3moveTop1,
  Player3moveTop2,
  Player3moveTop2,
  Player3moveTop2,
];

export const Player3MoveBottom = [
  Player3moveBottom1,
  Player3moveBottom1,
  Player3moveBottom1,
  Player3moveBottom2,
  Player3moveBottom2,
  Player3moveBottom2,
];

// player 4
import Player4moveL6 from './assets/characters/red/moveL6.png';
import Player4moveL5 from './assets/characters/red/moveL5.png';
import Player4moveL4 from './assets/characters/red/moveL4.png';
import Player4moveL3 from './assets/characters/red/moveL3.png';
import Player4moveL2 from './assets/characters/red/moveL2.png';
import Player4moveL1 from './assets/characters/red/moveL1.png';

import Player4moveR1 from './assets/characters/red/moveR1.png';
import Player4moveR2 from './assets/characters/red/moveR2.png';
import Player4moveR3 from './assets/characters/red/moveR3.png';
import Player4moveR4 from './assets/characters/red/moveR4.png';
import Player4moveR5 from './assets/characters/red/moveR5.png';
import Player4moveR6 from './assets/characters/red/moveR6.png';

import Player4moveBottom1 from './assets/characters/red/frontM1.png';
import Player4moveBottom2 from './assets/characters/red/frontM2.png';

import Player4moveTop1 from './assets/characters/red/backM1.png';
import Player4moveTop2 from './assets/characters/red/backM2.png';

export const Player4MoveLeft = [
  Player4moveL6,
  Player4moveL5,
  Player4moveL4,
  Player4moveL3,
  Player4moveL2,
  Player4moveL1,
];
export const Player4MoveRight = [
  Player4moveR1,
  Player4moveR2,
  Player4moveR3,
  Player4moveR4,
  Player4moveR5,
  Player4moveR6,
];

export const Player4MoveTop = [
  Player4moveTop1,
  Player4moveTop1,
  Player4moveTop1,
  Player4moveTop2,
  Player4moveTop2,
  Player4moveTop2,
];

export const Player4MoveBottom = [
  Player4moveBottom1,
  Player4moveBottom1,
  Player4moveBottom1,
  Player4moveBottom2,
  Player4moveBottom2,
  Player4moveBottom2,
];
