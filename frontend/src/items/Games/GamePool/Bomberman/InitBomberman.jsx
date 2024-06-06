import { useEffect } from 'react';

import { initBomberman } from './main';

const InitBomberman = () => {
  useEffect(() => {
    initBomberman();
  }, []);
  return <div id='bomberman-root'></div>;
};

export default InitBomberman;
