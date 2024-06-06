import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GetStatus } from '../../../../connections/statusConnection';

import { initBomberman } from './main';

const InitBomberman = () => {
  const [modal, logout] = useOutletContext();
  useEffect(() => {
    modal(true)
    GetStatus().then((data) => {
      if (data.login !== 'success') {
        logout();
      } else {
        initBomberman();
        modal(false);
      }
    });
  }, []);
  return <div id='bomberman-root'></div>;
};

export default InitBomberman;
