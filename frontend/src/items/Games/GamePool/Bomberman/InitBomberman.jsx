import { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GetStatus } from '../../../../connections/statusConnection';

import { initBomberman } from './main';

const InitBomberman = (grid) => {
  const [player1Location, setPlayer1Location] = useState(31);
  const [player2Location, setPlayer2Location] = useState(58);
  const [player3Location, setPlayer3Location] = useState(541);
  const [player4Location, setPlayer4Location] = useState(568);
  const [modal, logout, sendJsonMessage, lastMessage] = useOutletContext();
  const players = {
    player1: player1Location,
    player2: player2Location,
    player3: player3Location,
    player4: player4Location,
  };
  useEffect(() => {
    modal(true);
    GetStatus().then((data) => {
      if (data?.login !== 'success') {
        logout();
      } else {
        initBomberman(players, grid);
        modal(false);
      }
    });
  }, []);
  useEffect(() => {
    sendJsonMessage({
      type: 'bombermanCoords',
      coords: player1Location.toString(),
    });
  }, [player1Location]);
  return <div id='bomberman-root'></div>;
};

export default InitBomberman;
