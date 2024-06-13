import { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GetStatus } from '../../../../connections/statusConnection';

import { initBomberman, generateGrid, movePlayer } from './main';

const InitBomberman = ({ grid, currentUser, gameParty }) => {
  const [playerPos, setPlayerPos] = useState(0)
  const [player1Location, setPlayer1Location] = useState(16);
  const [player2Location, setPlayer2Location] = useState(28);
  const [player3Location, setPlayer3Location] = useState(166);
  const [player4Location, setPlayer4Location] = useState(178);
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
        const root = document.querySelector('#bomberman-root');
        root.appendChild(generateGrid(grid));
        initBomberman(players, currentUser, setPlayerPos);
        modal(false);
      }
    });
  }, []);
  
  useEffect(() => {
    if (playerPos !== 0) {
      sendJsonMessage({
        type: 'bombermanCoords',
        coords: playerPos.toString(),
        gameParty: gameParty
      });
    }
  }, [playerPos]);
  
  useEffect(() => {
    if (lastMessage) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.type == 'bombermanCoords') {
        movePlayer(messageData.fromuserId , messageData.coords);
      }
    }
  }, [lastMessage]);  

  return <div id='bomberman-root'></div>;
};

export default InitBomberman;
