import { useState } from 'react';
import styles from './tictactoe.module.css';
import ButtonOption from './ButtonOption';

const TicTacToe = () => {
  const [counter, setCounter] = useState(0);
  const gameValues = [
    { player: '', id: '1' },
    { player: '', id: '2' },
    { player: '', id: '3' },
    { player: '', id: '4' },
    { player: '', id: '5' },
    { player: '', id: '6' },
    { player: '', id: '7' },
    { player: '', id: '8' },
    { player: '', id: '9' },
  ];
  return (
    <div className={styles.GameContainer}>
      <div className={styles.columnFlex}>
        <div className={styles.rowFlex}>
          <div>
            <ButtonOption
              player={gameValues[0].player}
              counter={counter}
              setCounter={setCounter}
              playerId={gameValues[0].id}
            ></ButtonOption>
          </div>
          <div>
            <ButtonOption
              player={gameValues[1].player}
              counter={counter}
              setCounter={setCounter}
              playerId={gameValues[1].id}
            ></ButtonOption>
          </div>
          <div>
            <ButtonOption
              player={gameValues[2].player}
              counter={counter}
              setCounter={setCounter}
              playerId={gameValues[2].id}
            ></ButtonOption>
          </div>
        </div>
        <div className={styles.rowFlex}>
          <div>
            <ButtonOption
              player={gameValues[3].player}
              counter={counter}
              setCounter={setCounter}
              playerId={gameValues[3].id}
            ></ButtonOption>
          </div>
          <div>
            <ButtonOption
              player={gameValues[4].player}
              counter={counter}
              setCounter={setCounter}
              playerId={gameValues[4].id}
            ></ButtonOption>
          </div>
          <div>
            <ButtonOption
              player={gameValues[5].player}
              counter={counter}
              setCounter={setCounter}
              playerId={gameValues[5].id}
            ></ButtonOption>
          </div>
        </div>
        <div className={styles.rowFlex}>
          <div>
            <ButtonOption
              player={gameValues[6].player}
              counter={counter}
              setCounter={setCounter}
              playerId={gameValues[6].id}
            ></ButtonOption>
          </div>
          <div>
            <ButtonOption
              player={gameValues[7].player}
              counter={counter}
              setCounter={setCounter}
              playerId={gameValues[7].id}
            ></ButtonOption>
          </div>
          <div>
            <ButtonOption
              player={gameValues[8].player}
              counter={counter}
              setCounter={setCounter}
              playerId={gameValues[8].id}
            ></ButtonOption>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
