import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GetStatus } from '../../../../connections/statusConnection';

import {
  initBomberman,
  updatePlayerPosition,
  updateBombArray,
  removePowerUp,
  death,
} from './main';

const InitBomberman = ({ currentUser, grid, gameTag, group }) => {
  const [modal, logout, sendJsonMessage, lastMessage] = useOutletContext();
  const [gameTick, setGameTick] = useState(0);
  const currentGameTickRef = useRef(0);
  const playersRef = useRef({});

  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.type === 'bombermanCoords') {
        if (messageData.gameTag && playersRef.current[messageData.gameTag]) {
          updatePlayerPosition(
            playersRef.current[messageData.gameTag].element,
            messageData.coordX,
            messageData.coordY
          );
        }
      }
      if (messageData.type === 'removePwrUp') {
        removePowerUp(messageData.removePwrUp, grid);
      }
      if (messageData.type === 'bombPlanted') {
        let socketBombs = messageData.bombs;
        updateBombArray(socketBombs);
      }
      if (messageData.type === 'deadPlayer') {
        death(messageData.deadPlayer, messageData.bloodStainXY);
      }
      if (messageData.type === 'gameUpdate') {
        setGameTick(messageData.gameTick);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    currentGameTickRef.current = gameTick;
  }, [gameTick]);

  useEffect(() => {
    modal(true);
    GetStatus().then((data) => {
      if (data?.login !== 'success') {
        logout();
      } else {
        initBomberman(
          grid,
          gameTag,
          group,
          sendJsonMessage,
          playersRef,
          currentUser,
          gameTick,
          currentGameTickRef
        );
        modal(false);
      }
    });
  }, []);

  return <div id='bomberman-root'></div>;
};

export default InitBomberman;
