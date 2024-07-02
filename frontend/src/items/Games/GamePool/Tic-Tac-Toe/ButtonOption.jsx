import { useState } from 'react';
import styles from './ButtonOption.module.css';

const ButtonOption = (props) => {
  const [player, setPlayer] = useState(props.player);

  const playerPicker = () => {
    if (player.length === 0) {
      if (props.counter % 2 == 0) {
        setPlayer('X');
        props.setCounter((prev) => prev + 1);
      } else {
        setPlayer('O');
        props.setCounter((prev) => prev + 1);
      }
    }
  };
  return (
    <div>
      <button className={styles.gameButton} onClick={playerPicker}>
        {player}
      </button>
    </div>
  );
};

export default ButtonOption;
