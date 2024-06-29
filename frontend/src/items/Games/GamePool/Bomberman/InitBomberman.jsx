import { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GetStatus } from '../../../../connections/statusConnection';

import { initBomberman, updatePlayerPosition, updateBombPosition, removePowerUp, death } from './main';

const InitBomberman = ({ currentUser, grid, gameTag, group }) => {
  const [modal, logout, sendJsonMessage, lastMessage] = useOutletContext();
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
        removePowerUp(messageData.removePwrUp, grid, messageData.gameTag)
      }
      if (messageData.type === 'bombPlanted') {
        updateBombPosition(messageData.bombs, messageData.divIndex, grid, messageData.gameTag);
      }
      if (messageData.type === 'deadPlayer') {
        death(messageData.deadPlayer, messageData.bloodStainXY)
      }
    }
  });

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
          currentUser
        );
        modal(false);
      }
    });
  }, []);

  return <div id='bomberman-root'></div>;
};

export default InitBomberman;
