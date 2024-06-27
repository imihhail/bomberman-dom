import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GetStatus } from '../../../../connections/statusConnection';
import "./tetris.css"
import { initTetris2 } from './make-your-game';

const InitTetris2 = () => {
  const [modal, logout] = useOutletContext();
  useEffect(() => {
    modal(true);
    GetStatus().then((data) => {
      if (data.login !== 'success') {
        logout();
      } else {
        initTetris2();
        modal(false);
      }
    });
  }, []);
  return <div id='tetris2-root'></div>;
};

export default InitTetris2;
