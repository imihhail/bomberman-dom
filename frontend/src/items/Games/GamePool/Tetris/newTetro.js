import { IconPool } from './assets/gameIcons.js';

const colorList = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'indigo',
  'violet',
  'black',
];

export const newTetro = () => {
  return {
    side: 0,
    coordX: 0,
    coordY: 0,
    middlemanX: 0,
    middlemanY: 0,
    middlemanSide: 0,
    randomIcon: IconPool[Math.floor(Math.random() * 7)],
    randomColor: colorList[Math.floor(Math.random() * 7)],
  };
};
