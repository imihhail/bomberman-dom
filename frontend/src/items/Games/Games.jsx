import { useState, useEffect } from 'react';
import styles from './Games.module.css';
import { Link, Outlet, useOutletContext } from 'react-router-dom';
import { GetStatus } from '../../connections/statusConnection';

import tetris from './GamePool/Tetris/tetris.gif';
import tetris2 from './GamePool/Tetris2/tetris2.gif';
import bomberman from './GamePool/Bomberman/bomberman.gif';
import Arkanoid from './GamePool/Arkanoid/arkanoid.gif';

const Games = () => {
  const [gameSelected, setGameSelected] = useState(false);
  const [background, setBackground] = useState(false);
  const [
    modal,
    logout,
    sendJsonMessage,
    lastMessage,
    readyState,
    activeSession,
  ] = useOutletContext();

  useEffect(() => {
    modal(true);
    GetStatus().then((data) => {
      if (data.login !== 'success') {
        logout();
      } else {
        setBackground('test')
        modal(false);
      }
    });
  }, []);

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
            to={'/games/tetris2'}
            className={styles.gameLink}
          >
            <img className={styles.gameIcon} src={tetris2} />
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
              modal,
              logout,
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
