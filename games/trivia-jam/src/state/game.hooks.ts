import { useContext } from 'react';
import { GameContext } from './game.context';

const useGameContext = () => {
  return useContext(GameContext);
};

export const useTriviaJamSharedActor = () => {
  const { triviaJamSharedActor } = useGameContext();
  return triviaJamSharedActor;
};

export const useSharedCollectionActor = () => {
  const { sharedCollectionActor } = useGameContext();
  return sharedCollectionActor;
};
