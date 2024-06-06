import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GetStatus } from '../../../../connections/statusConnection';

import { initBomberman } from './main';

const InitBomberman = () => {
  const [playerLocation, setPlayerLocation] = useState(31);
  const [modal, logout, sendJsonMessage, lastMessage] = useOutletContext();

  useEffect(() => {
    modal(true);
    GetStatus().then((data) => {
      if (data?.login !== 'success') {
        logout();
      } else {
        initBomberman(playerLocation, setPlayerLocation);
        modal(false);
      }
    });
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
