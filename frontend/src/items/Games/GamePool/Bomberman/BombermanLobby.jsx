import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GetGameQueue } from '../../../../connections/getGameQueue';
import { JoinGameQueue } from '../../../../connections/joinGameQueue';
import InitBomberman from './InitBomberman';

import styles from './BombermanLobby.module.css';

const BombermanLobby = () => {
  const [, logout] = useOutletContext();
  const [activeGame, setActiveGame] = useState(false);
  const [gameQueue, setGameQueue] = useState([]);
  const [userEmail, setUserEmail] = useState([]);

  useEffect(() => {
    GetGameQueue().then((data) => {
      if (data?.login !== 'success') {
        logout();
      } else {
        console.log(data.gameQueue);
        setGameQueue(data.gameQueue);
        setUserEmail(data.useremail);
      }
    });
  }, []);

  const handleJoinLobby = () => {
    if (!gameQueue.map((names) => names.LobbyUser).includes(userEmail)) {
      JoinGameQueue().then((data) => {
        if (data.join == 'success') {
          setGameQueue((prev) => [...prev, { LobbyUser: userEmail }]);
        } else {
          console.log('Failed to join!');
        }
      });
    }
  };

  return activeGame ? (
    <InitBomberman setActiveGame={setActiveGame} />
  ) : (
    <div className={styles.bombermanLobby}>
      {gameQueue.map((eachUser, key) => (
        <p className={styles.lobbyListName} key={key}>
          <span className={styles.lobbyJoin}>Player {key + 1}</span>
          {eachUser.LobbyUser}
        </p>
      ))}
      <span className={styles.joinQueue} onClick={handleJoinLobby}>
        Join Queue
      </span>
    </div>
  );
};

export default BombermanLobby;
