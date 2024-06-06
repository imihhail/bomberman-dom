import { Grid } from './assets/buildGrid.js';
import { NewElement } from './helper.js';
import { newTetro } from './newTetro.js';

// start Game
export const Game = (engine) => {
  let grid = Grid();
  let allBoxes = grid.querySelectorAll('.container_game_row_item');
  let allRows = grid.querySelectorAll('.container_game_row');
  const scoreElement = NewElement('div', 'container_score');
  const clockElement = NewElement('div', 'container_score');
  const livesElement = NewElement('div', 'container_score');
  scoreElement.innerHTML = 'Score: 0';
  livesElement.innerHTML = 'Lives: 3';
  clockElement.innerHTML = '0s';

  let running;
  let defaulttickSpeed = 60;
  let tickSpeed = defaulttickSpeed;
  let score = 0;
  let tick = 0;
  let clockTick = 0;
  let menuOpen = false;
  let second = 0;
  let curr = newTetro();
  let lives = 3;

  window.onblur = function () {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  };

  const handleMovemement = (e) => {
    if (e.key == 'ArrowLeft') {
      curr.coordY--;
      if ((curr.randomIcon[curr.side][0] % 10) + curr.coordY < 0) {
        curr.coordY++;
      }
      // Arrow Right
    } else if (e.key == 'ArrowRight') {
      curr.coordY++;
      if ((curr.randomIcon[curr.side][3] % 10) + curr.coordY > 9) {
        curr.coordY--;
      }
      // Arrow Down
    } else if (e.key == 'ArrowDown') {
      curr.coordX += 10;
      // Arrow Up
    } else if (e.key == 'ArrowUp') {
      if (curr.side < 3) {
        curr.side++;
      } else {
        curr.side = 0;
      }
      // Escape pause
    } else if (e.key == 'Escape' && !menuOpen) {
      menuOpen = true;
      cancelAnimationFrame(running);

      // menu container
      let menuContinue = NewElement('div', 'container_menu_button_continue');

      // continue
      let gameContinue = NewElement(
        'button',
        'container_menu_button_continue_button',
        'Continue'
      );
      menuContinue.appendChild(gameContinue);
      gameContinue.addEventListener('click', () => {
        requestAnimationFrame(refresh);
        grid.removeChild(menuContinue);
        menuOpen = false;
        allBoxes.forEach((e) => {
          e.classList.remove('fade');
        });
      });
      // restart
      let gameRestart = NewElement(
        'a',
        'container_menu_button_continue_button',
        'Restart'
      );
      gameRestart.href = '/';
      menuContinue.appendChild(gameRestart);
      allBoxes.forEach((e) => {
        e.classList.add('fade');
      });
      grid.insertBefore(menuContinue, grid.firstChild);
    }
    window.removeEventListener('keydown', handleMovemement);
  };

  // animation start
  const refresh = (timestamp) => {

    // keyboard
    window.addEventListener('keydown', handleMovemement);

    // set max fps
    const deltaTime = timestamp - lastTimestamp;
    if (deltaTime < minFrameTime) {
      running = requestAnimationFrame(refresh);
      return;
    }
    // slow tick for time and scoring
    if (second == 60) {
      clockTick++;
      scoreElement.innerHTML = 'Score: ' + score;
      clockElement.innerHTML =
        'Time: ' +
        (clockTick < 60
          ? clockTick + 's'
          : Math.floor(clockTick / 60) +
            'm' +
            (clockTick - Math.floor(clockTick / 60) * 60) +
            's');
      second = 0;
    }
    if (tick >= tickSpeed) {
      tick = 0;
      curr.coordX += 10;
    }

    // check sides
    if (curr.middlemanY != curr.coordY) {
      for (let i = 0; i < curr.randomIcon[curr.side].length; i++) {
        if (
          allBoxes[
            curr.randomIcon[curr.side][i] + curr.coordX + curr.coordY
          ].classList.contains('freeze')
        ) {
          curr.coordY = curr.middlemanY;
        }
      }
    }

    // check rotation
    if (curr.middlemanSide != curr.side) {
      if (curr.coordY > 1) {
        if ((curr.randomIcon[curr.side][3] % 10) + curr.coordY == 10) {
          curr.coordY--;
        }
        if ((curr.randomIcon[curr.side][3] % 10) + curr.coordY > 10) {
          curr.coordY -= 2;
        }
      }
      if (curr.coordY < 1) {
        if ((curr.randomIcon[curr.side][0] % 10) + curr.coordY < 0) {
          curr.coordY++;
        }
      }
      for (let i = 0; i < curr.randomIcon[curr.side].length; i++) {
        if (
          allBoxes[
            curr.randomIcon[curr.side][i] + curr.coordX + curr.coordY
          ].classList.contains('freeze') ||
          allBoxes[
            curr.randomIcon[curr.side][i] + curr.coordX + curr.coordY - 1
          ].classList.contains('freeze') ||
          allBoxes[
            curr.randomIcon[curr.side][i] + curr.coordX + curr.coordY + 1
          ].classList.contains('freeze')
        ) {
          curr.side = curr.middlemanSide;
        }
      }
    }

    if (curr.middlemanX != curr.coordX) {
      // check bottom
      for (let i = 0; i < 4; i++) {
        if (
          curr.randomIcon[curr.side][i] + curr.coordX >= 200 ||
          allBoxes[
            curr.randomIcon[curr.side][i] + curr.coordX + curr.coordY
          ].classList.contains('freeze')
        ) {
          for (let j = 0; j < 4; j++) {
            allBoxes[
              curr.randomIcon[curr.middlemanSide][j] +
                curr.middlemanX +
                curr.middlemanY
            ].classList.add('freeze');
          }
          // check rows for deletion, score and new row
          for (let i = 0; i < 20; i++) {
            let boxCounter = 0;
            for (let j = 0; j < 10; j++) {
              if (allBoxes[i * 10 + j].classList.contains('freeze')) {
                boxCounter++;
              } else {
                break;
              }
              if (boxCounter == 10) {
                score++;
                if (tickSpeed > 10) {
                  tickSpeed -= 1;
                }
                grid.removeChild(allRows[i]);
                // create new row
                let gameConsoleRow = NewElement('div', 'container_game_row');
                for (let j = 0; j < 10; j++) {
                  let gameConsoleItem = NewElement(
                    'span',
                    'container_game_row_item'
                  );
                  gameConsoleRow.appendChild(gameConsoleItem);
                }
                grid.insertBefore(gameConsoleRow, grid.childNodes[1]);
                allBoxes = grid.querySelectorAll('.container_game_row_item');
                allRows = grid.querySelectorAll('.container_game_row');
              }
            }
          }
          // create new tetro if previous locks down
          if (
            allBoxes[4].classList.contains('freeze') ||
            allBoxes[5].classList.contains('freeze') ||
            allBoxes[14].classList.contains('freeze') ||
            allBoxes[15].classList.contains('freeze') ||
            allBoxes[24].classList.contains('freeze') ||
            allBoxes[25].classList.contains('freeze')
          ) {
            for (let i = 0; i < 20; i++) {
              grid.removeChild(allRows[i]);
              let gameConsoleRow = NewElement('div', 'container_game_row');
              for (let j = 0; j < 10; j++) {
                let gameConsoleItem = NewElement(
                  'span',
                  'container_game_row_item'
                );
                gameConsoleRow.appendChild(gameConsoleItem);
              }
              grid.insertBefore(gameConsoleRow, grid.childNodes[1]);
            }
            allBoxes = grid.querySelectorAll('.container_game_row_item');
            allRows = grid.querySelectorAll('.container_game_row');
            lives--;
            livesElement.innerHTML = 'Lives: ' + lives;
          }
          if (lives > 0) {
            curr = newTetro();
          } else {
            for (let i = 0; i < 20; i++) {
              grid.removeChild(allRows[i]);
            }
            livesElement.innerHTML = 'GAME OVER!';
            cancelAnimationFrame(running);
            return;
          }
          break;
        }
      }
    }

    // tetro movement animation
    if (
      curr.middlemanX != curr.coordX ||
      curr.middlemanY != curr.coordY ||
      curr.middlemanSide != curr.side ||
      curr.coordX == 0
    ) {
      curr.randomIcon[curr.middlemanSide].forEach((i) => {
        allBoxes[i + curr.middlemanX + curr.middlemanY].classList.remove(
          'filled'
        );
        allBoxes[i + curr.middlemanX + curr.middlemanY].classList.remove(
          curr.randomColor
        );
      });

      curr.randomIcon[curr.side].forEach((i) => {
        if (
          allBoxes[i + curr.coordX + curr.coordY].classList.contains('filled')
        ) {
          allBoxes[i + curr.middlemanX + curr.middlemanY].classList.add(
            'filled'
          );
          allBoxes[i + curr.middlemanX + curr.middlemanY].classList.add(
            curr.randomColor
          );
        } else {
          allBoxes[i + curr.coordX + curr.coordY].classList.add('filled');
          allBoxes[i + curr.coordX + curr.coordY].classList.add(
            curr.randomColor
          );
        }
      });

      // prev coord save
      curr.middlemanX = curr.coordX;
      curr.middlemanY = curr.coordY;
      curr.middlemanSide = curr.side;
    }
    // fast tick
    tick++;
    second++;
    lastTimestamp = timestamp;
    running = requestAnimationFrame(refresh);
    // }, 1000 / 60);
  };
  let lastTimestamp = performance.now();
  const minFrameTime = 1000 / 60;
  if (engine == 'Start') {
    running = requestAnimationFrame(refresh);
  }

  // grid.appendChild(scoreElement);
  // grid.appendChild(clockElement);
  // grid.appendChild(livesElement);

  return [grid, scoreElement, clockElement, livesElement];
};
