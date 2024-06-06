import styles from './Games.module.css';
import { Link, Outlet, useOutletContext } from 'react-router-dom';

const Games = () => {
  const [
    setShowModal,
    handleLogout,
    sendJsonMessage,
    lastMessage,
    readyState,
    activeSession,
  ] = useOutletContext();
  return (
    <div className={styles.container}>
      <div className={styles.gamesMenu}>
        <Link to={'/games/tetris'} className={styles.gameLink}>
          Tetris
        </Link>
        <Link to={'/games/arkanoid'} className={styles.gameLink}>
          Arkanoid
        </Link>
        <Link to={'/games/bomberman'} className={styles.gameLink}>
          Bomberman
        </Link>
      </div>
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
    </div>
  );
};

export default Games;
