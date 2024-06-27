import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GetStatus } from '../../../../connections/statusConnection';
import "./style.css"
import { initArkanoid } from './app';

import styles from './InitArkanoid.module.css';

const InitArkanoid = () => {
  const [modal, logout] = useOutletContext();
  useEffect(() => {
    modal(true);
    GetStatus().then((data) => {
      if (data.login !== 'success') {
        logout();
      } else {
        initArkanoid();
        modal(false);
      }
    });
  }, []);
  return (
    <div className={styles.content}>
      <div className={styles.content_info}>
        <div className={styles.content_info_score}>
          Score: <span id='score'></span>
          <div className='timer'>
            Timer: <span id='timer'>0</span>
          </div>
        </div>
        <div className={styles.content_info_health}>
          <span id='health'></span>
        </div>
      </div>

      <div className={styles.grid} id="gamegrid">
        <span id='gameover'></span>
      </div>
      <div className={styles.content_buttons}>
        <button className={styles.content_buttons_start} id='startButton'>
          Start
        </button>
        <button className={styles.content_buttons_pause} id='pauseButton'>
          Pause
        </button>
      </div>
    </div>
  );
};

export default InitArkanoid;
