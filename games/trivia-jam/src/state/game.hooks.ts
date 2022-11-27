import { useContext } from 'react';
import { GameContext } from './game.context';

const useGameContext = () => {
  return useContext(GameContext);
};

export const useGameSharedService = () => {
  const { sharedService } = useGameContext();
  return sharedService;
};
