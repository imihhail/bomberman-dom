import { useState } from 'react';
import styles from './Games.module.css';
import { Link, Outlet, useOutletContext } from 'react-router-dom';

import tetris from './GamePool/Tetris/tetris.gif';
import bomberman from './GamePool/Bomberman/bomberman.gif';
import Arkanoid from './GamePool/Arkanoid/Arkanoid.jpg';

const Games = () => {
  const [gameSelected, setGameSelected] = useState(false);
  const [
    setShowModal,
    handleLogout,
    sendJsonMessage,
    lastMessage,
    readyState,
    activeSession,
  ] = useOutletContext();

  const handleGameSelect = () => {
    setGameSelected(!gameSelected);
  };
  return (
    <div className={styles.container}>
      {!gameSelected && (
        <div className={styles.gamesMenu}>
          <Link
            onClick={handleGameSelect}
            to={'/games/bomberman'}
            className={styles.gameLink}
          >
            <img className={styles.gameIcon} src={bomberman} />
          </Link>
          <Link
            onClick={handleGameSelect}
            to={'/games/tetris'}
            className={styles.gameLink}
          >
            <img className={styles.gameIcon} src={tetris} />
          </Link>
          <Link
            onClick={handleGameSelect}
            to={'/games/arkanoid'}
            className={styles.gameLink}
          >
            <img className={styles.gameIcon} src={Arkanoid} />
          </Link>
        </div>
      )}
      {gameSelected && (
        <button className={styles.back} onClick={handleGameSelect}>
          Back
        </button>
      )}
      {gameSelected && (
        <div className={styles.gameConsole}>
          <Outlet
            context={[
              setShowModal,
              handleLogout,
              sendJsonMessage,
              lastMessage,
              readyState,
              activeSession,
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default Games;
