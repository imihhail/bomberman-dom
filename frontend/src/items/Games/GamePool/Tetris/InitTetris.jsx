import { useEffect } from 'react';

import { initializeTetris } from './main';

const InitTetris = () => {
  useEffect(() => {
    initializeTetris();
  }, []);
  return <div id='tetris-root'></div>;
};

export default InitTetris;
