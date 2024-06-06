import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GetStatus } from '../../../../connections/statusConnection';

import { initializeTetris } from './main';

const InitTetris = () => {
  
  const [modal, logout] = useOutletContext();
  useEffect(() => {
    modal(true);
    GetStatus().then((data) => {
      if (data.login !== 'success') {
        logout();
      } else {
        initializeTetris();
        modal(false);
      }
    });
  }, []);
  return <div id='tetris-root'></div>;
};

export default InitTetris;
