import { NewElement } from '../helper.js';

export const Grid = () => {
  let gridContainer = NewElement('div','container_game');
  for (let i = 0; i < 20; i++) {
    let gameConsoleRow = NewElement('div','container_game_row');
    for (let j = 0; j < 10; j++) {
      let gameConsoleItem = NewElement('span','container_game_row_item');
      gameConsoleRow.appendChild(gameConsoleItem);
    }
    gridContainer.appendChild(gameConsoleRow);
  }
  return gridContainer;
};
