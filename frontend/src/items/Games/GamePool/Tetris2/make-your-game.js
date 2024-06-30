export const initTetris2 = () => {
  // window.onresize = function () {
  //   location.reload();
  // };

  let frame = document.createElement('div');
  frame.className = 'frame';

  const Fps = document.createElement("p")
  Fps.className = "showFPS"
  frame.appendChild(Fps)

  let score = 0;
  let life = 1;
  let countdown = 60;
  let gameOver = false;

  let statsFrame = document.createElement('div');
  statsFrame.className = 'test';
  let scoreTag = document.createElement('p');
  scoreTag.style.zIndex = '1';
  scoreTag.style.marginTop = '0px';
  scoreTag.innerHTML = `SCORE<br><br>${score}<br><br>`;
  let lifeTag = document.createElement('p');
  lifeTag.innerHTML = `LIFE LEFT<br><br>${life}<br><br>`;
  let timerTag = document.createElement('p');

  statsFrame.style.width = '180px';
  statsFrame.style.height = '300px';
  statsFrame.style.border = '14.4px ridge rgb(9, 23, 174)';
  statsFrame.style.padding = '14.4px';
  statsFrame.style.color = 'white';
  statsFrame.style.fontSize = '20px';
  

  let centerDiv = document.createElement('div');
  centerDiv.style.display = 'flex';
  centerDiv.style.justifyContent = 'center';

  let parentDiv = document.createElement('div');
  parentDiv.className = 'parent';
  parentDiv.style.display = 'flex';
  parentDiv.style.justifyContent = 'center';
  parentDiv.style.alignItems = 'center';

  let verticalDiv = document.createElement('div');
  verticalDiv.style.display = 'block';

  centerDiv.appendChild(frame);

  statsFrame.appendChild(scoreTag);
  statsFrame.appendChild(lifeTag);
  statsFrame.appendChild(timerTag);
  parentDiv.appendChild(centerDiv);
  parentDiv.appendChild(statsFrame);
  const root = document.querySelector('#tetris2-root');
  root.appendChild(parentDiv);
  root.style.overflow = 'hidden';

  let frameDivBottom = frame.getBoundingClientRect().bottom - 38;
  let frameDivX = frame.getBoundingClientRect().x + 38;
  let frameDivRight = frame.getBoundingClientRect().right - 38;
  let blockCounter = 1;
  let speed = 2;
  let animationId = null;
  let gamePaused = false;

  let yPos = 0;
  let rotation = 0;
  let changeMirror

  let then = Date.now();
  let now;
  let countFPS = 0;
  let fps = 0;
  let lastFPSUpdateTime = Date.now();

  function line() {
    let backroundChoice = '';
    let quadraBackground = document.createElement('div');
    quadraBackground.className = 'cubeBackground';
    quadraBackground.setAttribute('id', blockCounter);

    let tripleBackground = document.createElement('div');
    tripleBackground.className = 'restBackground';
    tripleBackground.setAttribute('id', blockCounter);

    let randomNumber = Math.floor(Math.random() * 5);
    let randomMirror = Math.floor(Math.random() * 2);
    changeMirror = randomMirror

    if (randomNumber == 0) {
      tetra0(quadraBackground), (backroundChoice = quadraBackground);
    } else if (randomNumber == 1) {
      tetra1(tripleBackground), (backroundChoice = tripleBackground);
    } else if (randomNumber == 2) {
      tetra2(tripleBackground), (backroundChoice = tripleBackground);
    } else if (randomNumber == 3) {
      tetra3(tripleBackground), (backroundChoice = tripleBackground);
    } else if (randomNumber == 4) {
      tetra4(tripleBackground), (backroundChoice = tripleBackground);
    }

    backroundChoice.style.marginLeft = '114px';
    if (randomMirror == 0) {
      backroundChoice.style.transform = 'rotateY(180deg)';
    }

    let allBlocks = document.querySelectorAll(
      `.oneBlock:not([id="${blockCounter}"])`
    );
    let fallingBlocks = document.querySelectorAll(
      `.oneBlock[id="${blockCounter}"]`
    );

    document.addEventListener('keydown', (e) => {
      const keyName = e.key;
      let fallingBlocks = Array.from(
        document.querySelectorAll(`.oneBlock[id="${blockCounter}"]`)
      );

      var frameCollusion = fallingBlocks.some(
        (block) => block.getBoundingClientRect().right >= frameDivRight
      );

      if (
        keyName === 'ArrowRight' &&
        backroundChoice.id == blockCounter &&
        !frameCollusion &&
        !collusionCheck2()
      ) {
        backroundChoice.style.marginLeft =
          parseFloat(backroundChoice.style.marginLeft) + 38 + 'px';
      }
    });

    document.addEventListener('keydown', (e) => {
      const keyName = e.key;
      let fallingBlocks = Array.from(
        document.querySelectorAll(`.oneBlock[id="${blockCounter}"]`)
      );

      var frameCollusion = fallingBlocks.some(
        (block) => block.getBoundingClientRect().x <= frameDivX
      );

      if (
        keyName === 'ArrowLeft' &&
        backroundChoice.id == blockCounter &&
        !frameCollusion &&
        !collusionCheck3()
      ) {
        backroundChoice.style.marginLeft =
          parseFloat(backroundChoice.style.marginLeft) - 38 + 'px';
      }
    });

    document.addEventListener('keydown', (e) => {
      let fallingBlocks = Array.from(
        document.querySelectorAll(`.oneBlock[id="${blockCounter}"]`)
      );
      var frameCollusion = fallingBlocks.some(
        (block) => block.getBoundingClientRect().bottom >= frameDivBottom - 38
      );

      if (
        e.key === 'ArrowDown' &&
        backroundChoice.id == blockCounter &&
        !frameCollusion &&
        !collusionCheck1()
      ) {
        while (yPos % 38 !== 0) {
          yPos++;
        }
        speed = 19;
      }
    });


    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'ArrowUp' &&
        backroundChoice.id == blockCounter &&
        randomNumber != 2
      ) {
        const initialRotation = rotation;
        const initialTransform = backroundChoice.style.transform;
        const initialMarginLeft = backroundChoice.style.marginLeft;
        const initialMarginTop = backroundChoice.style.marginTop;
        let mirrorRot = 0;
        if (randomMirror == 0) {
          mirrorRot = 180;
        }

        rotation += 90;
        backroundChoice.style.transform = `rotate(${rotation}deg) rotateY(${mirrorRot}deg)`;
        for (let i = 0; i < allBlocks.length; i++) {
          for (let j = 0; j < fallingBlocks.length; j++) {
            let fallenBlocks = allBlocks[i].getBoundingClientRect();
            let fallingBlock = fallingBlocks[j].getBoundingClientRect();
            if (
              fallenBlocks.left <= fallingBlock.right &&
              fallenBlocks.right >= fallingBlock.left &&
              fallenBlocks.top <= fallingBlock.bottom &&
              fallenBlocks.bottom >= fallingBlock.top
            ) {
              rotation = initialRotation;
              backroundChoice.style.transform = initialTransform;
              backroundChoice.style.marginLeft = initialMarginLeft;
              backroundChoice.style.marginTop = initialMarginTop;
              return;
            }
          }
        }
        for (let i = 0; i < fallingBlocks.length; i++) {
          let fallingBlock = fallingBlocks[i].getBoundingClientRect();
          if (
            fallingBlock.x <= frameDivX - 38 ||
            fallingBlock.right >= frameDivRight + 38 ||
            fallingBlock.bottom >= frameDivBottom
          ) {
            rotation = initialRotation;
            backroundChoice.style.transform = initialTransform;
            backroundChoice.style.marginLeft = initialMarginLeft;
            backroundChoice.style.marginTop = initialMarginTop;
            return;
          }
        }
      }
      if (rotation == 360) {
        rotation = 0;
      }
    });

    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'p' &&
        !gameOver &&
        backroundChoice.id == blockCounter &&
        !gamePaused
      ) {
        gamePaused = true;
        let pauseDiv = document.createElement('div');
        let continueText = document.createElement('p');
        let restartText = document.createElement('p');

        pauseDiv.className = 'lost';
        continueText.innerHTML = 'CONTINUE';
        continueText.className = 'restartClass';
        restartText.innerHTML = 'RESTART';
        restartText.className = 'restartClass';

        restartText.addEventListener('click', () => {
          blockCounter = blockCounter + 1;
          yPos = 0;
          frame.innerHTML = '';
          gamePaused = false;
          pauseDiv.style.display = 'none';
          life = 1;
          score = 0;
          lifeTag.innerHTML = `LIFE LEFT<br><br>${life}<br><br>`;
          scoreTag.innerHTML = `SCORE<br><br>${score}<br><br>`;
          countdown = 61;
          line();
          drop()
        });

        continueText.addEventListener('click', () => {
          gamePaused = false;
          drop()
          pauseDiv.remove();

        });

        pauseDiv.appendChild(continueText);
        pauseDiv.appendChild(restartText);
        root.appendChild(pauseDiv);
      }
    });
  }

 
  function drop() {
    if (gamePaused || gameOver) {
      return
    }
    now = Date.now();
    let difference = now - then;
      
    if (difference > 1000/65) {
      countFPS++;
      if (now - lastFPSUpdateTime >= 1000) {
        fps = countFPS;
        countFPS = 0;
        lastFPSUpdateTime = now;
        Fps.textContent = `FPS: ${fps}`;
      }

      let fallingBlocks = Array.from(
        document.querySelectorAll(`.oneBlock[id="${blockCounter}"]`)
      );
  
      var frameCollusion = fallingBlocks.some(
        (block) => block.getBoundingClientRect().bottom >= frameDivBottom
      );
  
      if (!frameCollusion && !collusionCheck()) {
        yPos += speed;
        let backroundChoice =document.getElementById(blockCounter)
        backroundChoice.style.marginTop = `${yPos}px`;
        animationId = window.requestAnimationFrame(drop);
  
      } else {
        speed = 2;
        fallingBlocks.forEach((block) => {
          block.setAttribute('rotation', rotation);
          block.setAttribute('mirror', changeMirror);
        });
        blockCounter++;
        yPos = 0
        rotation = 0
        deleteRows();
        cancelAnimationFrame(animationId);
        line();
      }
      then = now
    }
    animationId = window.requestAnimationFrame(drop);
  }
 
  function collusionCheck() {
    let allBlocks = document.querySelectorAll(
      `.oneBlock:not([id="${blockCounter}"])`
    );
    let fallingBlocks = document.querySelectorAll(
      `.oneBlock[id="${blockCounter}"]`
    );
    for (let i = 0; i < allBlocks.length; i++) {
      for (let j = 0; j < fallingBlocks.length; j++) {
        if (
          allBlocks[i].getBoundingClientRect().left ==
            fallingBlocks[j].getBoundingClientRect().left &&
          allBlocks[i].getBoundingClientRect().top ==
            fallingBlocks[j].getBoundingClientRect().bottom
        ) {
          return true;
        }
      }
    }
    return false;
  }
  function collusionCheck1() {
    let allBlocks = document.querySelectorAll(
      `.oneBlock:not([id="${blockCounter}"])`
    );
    let fallingBlocks = document.querySelectorAll(
      `.oneBlock[id="${blockCounter}"]`
    );
    for (let i = 0; i < allBlocks.length; i++) {
      for (let j = 0; j < fallingBlocks.length; j++) {
        if (
          allBlocks[i].getBoundingClientRect().left ==
            fallingBlocks[j].getBoundingClientRect().left &&
          allBlocks[i].getBoundingClientRect().top - 38 <=
            fallingBlocks[j].getBoundingClientRect().bottom
        ) {
          return true;
        }
      }
    }
    return false;
  }
  function collusionCheck2() {
    let allBlocks = document.querySelectorAll(
      `.oneBlock:not([id="${blockCounter}"])`
    );
    let fallingBlocks = document.querySelectorAll(
      `.oneBlock[id="${blockCounter}"]`
    );

    for (let i = 0; i < allBlocks.length; i++) {
      for (let j = 0; j < fallingBlocks.length; j++) {
        if (
          allBlocks[i].getBoundingClientRect().left ==
            fallingBlocks[j].getBoundingClientRect().right &&
          allBlocks[i].getBoundingClientRect().top <=
            fallingBlocks[j].getBoundingClientRect().bottom &&
          allBlocks[i].getBoundingClientRect().bottom >=
            fallingBlocks[j].getBoundingClientRect().top
        ) {
          return true;
        }
      }
    }
    return false;
  }
  function collusionCheck3() {
    let allBlocks = document.querySelectorAll(
      `.oneBlock:not([id="${blockCounter}"])`
    );
    let fallingBlocks = document.querySelectorAll(
      `.oneBlock[id="${blockCounter}"]`
    );

    for (let i = 0; i < allBlocks.length; i++) {
      for (let j = 0; j < fallingBlocks.length; j++) {
        if (
          allBlocks[i].getBoundingClientRect().right ==
            fallingBlocks[j].getBoundingClientRect().left &&
          allBlocks[i].getBoundingClientRect().top <=
            fallingBlocks[j].getBoundingClientRect().bottom &&
          allBlocks[i].getBoundingClientRect().bottom >=
            fallingBlocks[j].getBoundingClientRect().top
        ) {
          return true;
        }
      }
    }
    return false;
  }

  function tetra1(tripleBackground) {
    let transforms = [
      'translate(38px)',
      'translate(38px, 38px)',
      'translate(76px, 38px)',
      'translate(38px, 76px)',
    ];

    for (let i = 0; i < 4; i++) {
      let singleBlock = document.createElement('div');
      singleBlock.className = 'oneBlock';
      singleBlock.id = blockCounter;
      singleBlock.style.background = 'rgb(249, 241, 0)';
      singleBlock.style.transform = transforms[i];
      singleBlock.style.top = '0px';
      singleBlock.style.margin = '0px';
      tripleBackground.appendChild(singleBlock);
    }
    frame.appendChild(tripleBackground);
  }

  function tetra0(quadraBackground) {
    for (let i = 0; i < 4; i++) {
      let singleBlock = document.createElement('div');
      singleBlock.className = 'oneBlock';
      singleBlock.setAttribute('id', blockCounter);
      singleBlock.style.background = 'rgb(0, 249, 75)';
      singleBlock.style.top = '0px';
      singleBlock.style.margin = '0px';
      quadraBackground.appendChild(singleBlock);
      if (i == 0) {
        singleBlock.style.transform = 'translate(76px, 0px)';
      }
      if (i == 1) {
        singleBlock.style.transform = 'translate(76px, 38px)';
      }
      if (i == 2) {
        singleBlock.style.transform = 'translate(76px, 76px)';
      }
      if (i == 3) {
        singleBlock.style.transform = 'translate(76px, 114px)';
      }
    }
    frame.appendChild(quadraBackground);
  }

  function tetra2(tripleBackground) {
    for (let i = 0; i < 4; i++) {
      let singleBlock = document.createElement('div');
      singleBlock.className = 'oneBlock';
      singleBlock.style.margin = '0px';
      if (i == 0) {
        singleBlock.style.transform = 'translate(76px, 0px)';
      }
      if (i == 1) {
        singleBlock.style.transform = 'translate(38px, 0px)';
      }
      if (i == 2) {
        singleBlock.style.transform = 'translate(76px, 38px)';
      }
      if (i == 3) {
        singleBlock.style.transform = 'translate(38px, 38px)';
      }
      singleBlock.setAttribute('id', blockCounter);
      singleBlock.style.background = 'rgb(218, 243, 243)';
      tripleBackground.appendChild(singleBlock);
    }
    frame.appendChild(tripleBackground);
  }

  function tetra3(tripleBackground) {
    for (let i = 0; i < 4; i++) {
      let singleBlock = document.createElement('div');
      singleBlock.className = 'oneBlock';
      singleBlock.style.margin = '0px';
      if (i == 0) {
        singleBlock.style.transform = 'translate(38px, 0px)';
      }
      if (i == 1) {
        singleBlock.style.transform = 'translate(38px, 38px)';
      }
      if (i == 2) {
        singleBlock.style.transform = 'translate(38px, 76px)';
      }
      if (i == 3) {
        singleBlock.style.transform = 'translate(76px, 76px)';
      }
      singleBlock.setAttribute('id', blockCounter);
      singleBlock.style.background = 'rgb(0, 220, 249)';
      tripleBackground.appendChild(singleBlock);
    }
    frame.appendChild(tripleBackground);
  }

  function tetra4(tripleBackground) {
    for (let i = 0; i < 4; i++) {
      let singleBlock = document.createElement('div');
      singleBlock.className = 'oneBlock';
      singleBlock.style.margin = '0px';
      if (i == 0) {
        singleBlock.style.transform = 'translate(38px, 0px)';
      }
      if (i == 1) {
        singleBlock.style.transform = 'translate(76px, 0px)';
      }
      if (i == 2) {
        singleBlock.style.transform = 'translate(38px, 38px)';
      }
      if (i == 3) {
        singleBlock.style.transform = 'translate(0px, 38px)';
      }
      singleBlock.setAttribute('id', blockCounter);
      singleBlock.style.background = 'rgb(255, 0, 17)';
      tripleBackground.appendChild(singleBlock);
    }
    frame.appendChild(tripleBackground);
  }

  function deleteRows() {
    let allBlocks = document.querySelectorAll(
      `.oneBlock:not([id="${blockCounter}"])`
    );
    var n = 38;
    var allFilledRows = [];
    var removedRowFloor = 0;
    var removeCount = 0;
    var countRemovedFloors = 0;

    for (let y = 0; y < 20; y++) {
      let rowOccupancy = Array.from(allBlocks).filter(
        (block) => block.getBoundingClientRect().top === frameDivBottom - n
      );
      allFilledRows.push(rowOccupancy);
      if (allFilledRows[y].length == 10) {
        for (let x = 0; x < allFilledRows[y].length; x++) {
          removedRowFloor =
            allFilledRows[y][x].getBoundingClientRect().top +
            countRemovedFloors;
          allFilledRows[y][x].remove();
          removeCount++;

          if (removeCount === 10) {
            score += 10;
            countdown += 4;
            scoreTag.innerHTML = `SCORE<br><br>${score}<br><br>`;
            scoreTag.style.color = 'rgb(64, 255, 0)';
            scoreTag.style.transform = 'scale(1.1)';
            timerTag.style.color = 'rgb(64, 255, 0)';
            timerTag.style.transform = 'scale(1.1)';
            setTimeout(function () {
              scoreTag.style.color = '';
              scoreTag.style.transform = '';
              timerTag.style.color = '';
              timerTag.style.transform = '';
            }, 300);
            adjustBlocks(allBlocks, removedRowFloor);
            removeCount = 0;
          }
        }
        countRemovedFloors += 38;
      }
      n += 38;
    }
    if (allFilledRows[19].length != 0) {
      life -= 1;
      lifeTag.innerHTML = `LIFE LEFT<br><br>${life}<br><br>`;
      gameOver = true;
      GameOverWindow()
    }
  }

  function adjustBlocks(allBlocks, removedRowFloor) {
    setTimeout(() => {
      allBlocks.forEach((block) => {
        if (block.getBoundingClientRect().top < removedRowFloor) {
          const rotation = block.getAttribute('rotation');
          const mirror = block.getAttribute('mirror');
          const adjustment =
            rotation === '0' ||
            (rotation === '270' && mirror === '0') ||
            (rotation === '90' && mirror === '1')
              ? 38
              : -38;
          if (rotation === '0' || rotation === '180') {
            block.style.marginTop = `${
              parseFloat(block.style.marginTop) + adjustment
            }px`;
          } else {
            block.style.marginLeft = `${
              parseFloat(block.style.marginLeft) + adjustment
            }px`;
          }
        }
      });
    }, 400);
  }

  function startCountdown() {
    function updateDisplay() {
      let minutes = Math.floor(countdown / 60);
      let seconds = countdown % 60;
      timerTag.innerHTML = `TIME LEFT <br><br> ${minutes}:${
        seconds < 10 ? '0' : ''
      }${seconds}`;
    }
    updateDisplay();

    let intervalId = setInterval(() => {
      if (gamePaused) {
        return;
      }
      countdown--;
      updateDisplay();

      if (gameOver) {
        clearInterval(intervalId);
      }
      if (countdown < 1) {
        clearInterval(intervalId);
        life -= 1;
        lifeTag.innerHTML = `LIFE LEFT<br><br>${life}<br><br>`;
        gameOver = true;
        GameOverWindow()
        yPos = 0
        rotation = 0
      }
    }, 1000);
  }

  function GameOverWindow() {
    let loseWindow = document.createElement('div');
    loseWindow.className = 'lost';
    loseWindow.innerHTML = 'GAME OVER';

    let restardText = document.createElement('p');
    restardText.className = 'restartClass';
    restardText.innerHTML = 'RESTART';

    restardText.addEventListener('click', () => {
      blockCounter = blockCounter + 1;
      frame.innerHTML = '';
      frame.appendChild(Fps)
      gameOver = false;
      loseWindow.style.display = 'none';
      life = 1;
      score = 0;
      lifeTag.innerHTML = `LIFE LEFT<br><br>${life}<br><br>`;
      scoreTag.innerHTML = `SCORE<br><br>${score}<br><br>`;
      countdown = 60;
      loseWindow.remove()
      startCountdown();
      line();
      drop()
    });

    loseWindow.appendChild(restardText);
    root.appendChild(loseWindow);
  }

  function welcomeMenu() {
    let welcomeFlag = false;
    let welcomeWindow = document.createElement('div');
    welcomeWindow.className = 'welcomeClass';
    welcomeWindow.innerHTML =
      'Welcome to TETRIS!<br><br><br>Press ENTER to play<br><br>Press P to pause<br><br>Use arrowkeys to navigate<br><br>Set browser zoom to 100%';

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !welcomeFlag) {
        statsFrame.style.transform = 'translateX(150%)';
        startCountdown();
        line();
        welcomeFlag = true;
        welcomeWindow.remove();
        drop()
      }
    });
    root.appendChild(welcomeWindow);
  }
  welcomeMenu();
};
