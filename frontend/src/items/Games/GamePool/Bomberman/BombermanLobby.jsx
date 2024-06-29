import { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GetGameQueue } from '../../../../connections/getGameQueue';
import { JoinGameQueue } from '../../../../connections/joinGameQueue';
import InitBomberman from './InitBomberman';

import styles from './BombermanLobby.module.css';

const BombermanLobby = () => {
  const [, logout, sendJsonMessage, lastMessage, readyState] =
    useOutletContext();
  const [activeGame, setActiveGame] = useState(false);
  const [gameQueue, setGameQueue] = useState([]);
  const [userEmail, setUserEmail] = useState([]);
  const [gameTag, setGameTag] = useState();
  const [lobbyInfo, setLobbyInfo] = useState('');
  const [timer, setTimer] = useState('');
  const [grid, setGrid] = useState([]);
  const [group, setGroup] = useState([]);
  const [gameParty, setGameParty] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [gameInLobby, setGameInLobby] = useState(true);
  const [lobbyChat, setLobbyChat] = useState([]);
  const [wsConnectionOpen, setWsConnectionOpen] = useState(false);
  const [lobbyChatInput, setLobbyChatInput] = useState('');
  const colorMap = ['royalblue', 'forestgreen', 'deeppink', 'firebrick'];
  const chatContainerRef = useRef(null);

  const handleGameQueue = () => {
    GetGameQueue().then((data) => {
      if (data?.login !== 'success') {
        logout();
      } else {
        setGameQueue(data.gameQueue);
        setUserEmail(data.useremail);
        setCurrentUser(data.userid);
      }
    });
  };
  useEffect(() => {
    handleGameQueue();
  }, []);

  useEffect(() => {
    if (readyState === 1) {
      setWsConnectionOpen(true);
    } else {
      setWsConnectionOpen(false);
    }
  }, [readyState]);

  const handleJoinLobby = () => {
    if (!gameQueue?.map((names) => names.LobbyUser).includes(userEmail)) {
      JoinGameQueue().then((data) => {
        if (data.join == 'success') {
          if (gameQueue != null) {
            if (gameQueue.length == 0) {
              setGameQueue([{ LobbyUser: userEmail }]);
            } else {
              setGameQueue((prev) => [...prev, { LobbyUser: userEmail }]);
            }
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
      if (messageData.type == 'refreshQueue') {
        handleGameQueue();
      } else if (messageData.type == 'gameLogic') {
        if (messageData.gamestatus == 'Start') {
          setLobbyInfo('Waiting for other players...');
        }
        if (messageData.gamestatus == 'Prepare') {
          setTimeout(() => {
            setLobbyInfo('Prepare for Battle!');
          }, 1000);
          if (messageData.grid) {
            setGrid(messageData.grid);
          }
          if (messageData.gameTag) {
            setGameTag(messageData.gameTag);
          }
          if (messageData.gameGroup) {
            setGroup(messageData.gameGroup);
          }
        }
        if (messageData.gamestatus == 'Fight') {
          setTimeout(() => {
            setTimer('');
            setLobbyInfo('FIGHT!!!');
          }, 1000);
          setTimeout(() => {
            setActiveGame(true);
          }, 2000);
        }
      } else if (messageData.type == 'countDown') {
        setTimer(messageData.countDown);
      } else if (messageData.type == 'lobbyMessage') {
        if (messageData.gamestatus == 'lobby') {
          setGameParty(messageData.gameParty);
          setGameInLobby(true);
        } else {
          setGameParty(messageData.gameGroup);
          setGameInLobby(false);
        }
        console.log(lobbyChat)
        console.log(messageData.gameParty)
        if (messageData.fromuserid && messageData.gameLobbyMessage) {
          setLobbyChat((prev) => [
            ...prev,
            { user: messageData.fromuserid, text: messageData.gameLobbyMessage, email: messageData.SenderEmail},
          ]);
        }
        setTimeout(() => {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }, 100);
      }
    }
  }, [lastMessage]);

  const handleLobbyMessage = () => {
    sendJsonMessage({
      type: 'lobbyMessage',
      fromuserid: currentUser,
      gamestatus: gameInLobby ? 'lobby' : '',
      gameParty: gameParty,
      gameLobbyMessage: lobbyChatInput,
      SenderEmail: userEmail,
    });
    setLobbyChatInput('');
  };

  const handleLobbyChatInput = (e) => {
    setLobbyChatInput(e.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLobbyMessage();
    }
  };

  return activeGame ? (
    <InitBomberman
      currentUser={currentUser}
      grid={grid}
      gameTag={gameTag}
      group={group}
    />
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
      <div className={styles.lobbyChat}>
        <div ref={chatContainerRef} className={styles.lobbyChatBox}>
          {lobbyChat?.map((item, i) => {
            const color = colorMap[gameParty.indexOf(item.user)];
            return (
              <div key={i} className={`${styles.lobbyChatRow}`}>
                <div className={styles.lobbyChatEmail}>
                  {item.email}
                </div>
                <div className={styles.lobbyChatProfileContent}>
                  <div className={styles.textContentMirrored} style={{backgroundColor: color}}>
                    {item.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {wsConnectionOpen ? (
          <div className={styles.lobbyChatInput}>
            <input
              value={lobbyChatInput}
              onChange={handleLobbyChatInput}
              onKeyDown={handleKeyPress}
              type='text'
            />
            <button type='submit' onClick={handleLobbyMessage}>
              Send
            </button>
          </div>
        ) : (
          <p>Connecting to chat!</p>
        )}
      </div>
      <span className={styles.joinQueue} onClick={handleJoinLobby}>
        Join Queue
      </span>
    </div>
  );
};

export default BombermanLobby;
