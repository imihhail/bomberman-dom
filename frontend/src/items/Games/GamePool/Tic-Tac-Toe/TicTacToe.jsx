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
          {gameValues.map((item) => (
            <ButtonOption
              key={item.id}
              coordValue={item}
              counter={counter}
              setCounter={setCounter}
            ></ButtonOption>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
