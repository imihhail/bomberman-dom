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
  const [gameParty, setGameParty] = useState([]);
  const [lobbyInfo, setLobbyInfo] = useState('');
  const [timer, setTimer] = useState('');
  const [grid, setGrid] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [lobbySize, setLobbySize] = useState(0);


  const handleGameQUeue = () => {
    GetGameQueue().then((data) => {
      setCurrentUser(data.userid)
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

  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      //console.log("msgData: ",messageData);
      if (messageData.type == 'refreshQueue') {
        handleGameQUeue();
      } else if (messageData.type == 'gameLogic') {
        if (messageData.gamestatus == 'Start') {
          setLobbyInfo("Waiting for other players...")
        }
        if (messageData.gamestatus == 'Prepare') {
          setTimeout(() => {
            setLobbyInfo("Prepare for Battle!")
          }, 1000)
          setGrid(messageData.grid)           
        }
        if (messageData.gamestatus == 'Fight') {
          setGameParty(messageData.gameParty)
          setTimeout(() => {
            setTimer('')
            setLobbyInfo("FIGHT!!!")
          }, 1000)
          setTimeout(() => {
            setActiveGame(true)
          }, 2000)      
        }

      } else if (messageData.type == 'countDown') {
        setTimer(messageData.countDown)
      }
    }
  }, [lastMessage]);  
  
   return activeGame ? (
    <InitBomberman grid={grid} currentUser={currentUser} gameParty={gameParty} />
  ) : (
    <div className={styles.bombermanLobby}>
      <div className={styles.gameCounter}>{timer}</div>
      <div className={styles.gameInfo}>{lobbyInfo}</div>
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
