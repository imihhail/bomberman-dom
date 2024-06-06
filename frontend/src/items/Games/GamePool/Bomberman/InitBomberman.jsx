import { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GetStatus } from '../../../../connections/statusConnection';

import { initBomberman } from './main';

const InitBomberman = () => {
  const [playerLocation, setPlayerLocation] = useState(31);
  const [modal, logout, sendJsonMessage, lastMessage] = useOutletContext();
  const gameInitialized = useRef(false);

  useEffect(() => {
    modal(true);
    GetStatus().then((data) => {
      if (data?.login !== 'success') {
        logout();
      } else {
        initBomberman(playerLocation, setPlayerLocation);
        gameInitialized.current = true;
        modal(false);
      }
    });
    return () => {
      const gameContainer = document.getElementById('bomberman-root');
      if (gameContainer) {
        while (gameContainer.firstChild) {
          gameContainer.removeChild(gameContainer.firstChild);
        }
      }
      gameInitialized.current = false; // Reset the ref on unmount
    };
  }, []);
  useEffect(() => {
    sendJsonMessage({
      type: 'bombermanCoords',
      coords: playerLocation.toString(),
    });
  }, [playerLocation]);
  return <div id='bomberman-root'></div>;
};

export default InitBomberman;
