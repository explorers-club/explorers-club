import { useContext } from 'react';
import { GameContext } from './game.context';

const useGameContext = () => {
  return useContext(GameContext);
};

export const useGameSharedService = () => {
  const { sharedGameService } = useGameContext();
  return sharedGameService;
};
