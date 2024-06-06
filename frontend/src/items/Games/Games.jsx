import styles from './Games.module.css';
import { Link, Outlet } from 'react-router-dom';

const Games = () => {
  return (
    <div className={styles.container}>
      <div className={styles.gamesMenu}>
        <Link to={'/games/tetris'} className={styles.gameLink}>
          Tetris
        </Link>
        <Link className={styles.gameLink}>Arkanoid</Link>
        <Link className={styles.gameLink}>Bomberman</Link>
      </div>
      <div className={styles.gameConsole}>
        <Outlet />
      </div>
    </div>
  );
};

export default Games;
