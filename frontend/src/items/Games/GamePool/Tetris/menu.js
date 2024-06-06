import { NewElement } from './helper.js';

// generate game menu
export const Menu = () => {
  let menuContainer = NewElement('div', 'container_menu');
  // menu container
  let nameContainer = NewElement('span', 'container_menu_title', 'TetriX');
  //   new game button
  let newGameContainer = NewElement(
    'button',
    'container_menu_button',
    'New Game'
  );

  //   append menu to root container
  menuContainer.appendChild(nameContainer);
  menuContainer.appendChild(newGameContainer);
  return [menuContainer, newGameContainer];
};

