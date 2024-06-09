import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GetGameQueue } from '../../../../connections/getGameQueue';
import { JoinGameQueue } from '../../../../connections/joinGameQueue';
import InitBomberman from './InitBomberman';

import styles from './BombermanLobby.module.css';

const BombermanLobby = () => {
  const [, logout, sendJsonMessage, lastMessage] = useOutletContext();
  const [activeGame, setActiveGame] = useState(false);
  const [gameQueue, setGameQueue] = useState([]);
  const [userEmail, setUserEmail] = useState([]);
  const [gameCounter, setGameCounter] = useState(20);

  const handleGameQUeue = () => {
    GetGameQueue().then((data) => {
      if (data?.login !== 'success') {
        logout();
      } else {
        setGameQueue(data.gameQueue);
        setUserEmail(data.useremail);
      }
    });
  };
  useEffect(() => {
    handleGameQUeue();
  }, []);

  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.type == 'refreshQueue') {
        handleGameQUeue();
      } else if (messageData.type == 'gameLogic') {
        if (messageData.gameStatus == 'Start') {
          counter(20);
        }
      }
    }
  }, [lastMessage]);

  const counter = (num) => {
    let timer = num;
    setTimeout(() => {
      setGameCounter(timer);
      console.log(timer);
      timer = timer - 1;
    }, 1000);
  };

  const handleJoinLobby = () => {
    if (!gameQueue?.map((names) => names.LobbyUser).includes(userEmail)) {
      JoinGameQueue().then((data) => {
        if (data.join == 'success') {
          if (gameQueue != null) {
            setGameQueue((prev) => [...prev, { LobbyUser: userEmail }]);
          } else {
            setGameQueue([{ LobbyUser: userEmail }]);
          }
          sendJsonMessage({ type: 'refreshQueue' });
        } else {
          console.log('Failed to switch!');
        }
      });
    } else if (gameQueue == null) {
      sendJsonMessage({ type: 'refreshQueue' });
      setGameQueue([{ LobbyUser: userEmail }]);
    }
  };

  return activeGame ? (
    <InitBomberman setActiveGame={setActiveGame} />
  ) : (
    <div className={styles.bombermanLobby}>
      <div className={styles.gameCounter}>{gameCounter}</div>
      {gameQueue?.map((eachUser, key) => (
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
