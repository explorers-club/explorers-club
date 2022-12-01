import { createActorByTypeSelector, ActorType } from '@explorers-club/actor';
import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { createSelector } from 'reselect';
import { GameContext } from './game.context';
import { TriviaJamSharedActor } from './trivia-jam-shared.machine';

const selectTriviaJamSharedActor = createSelector(
  createActorByTypeSelector<TriviaJamSharedActor>(
    ActorType.TRIVIA_JAM_SHARED_ACTOR
  ),
  (actors) => actors[0] as TriviaJamSharedActor
);

const useGameContext = () => {
  return useContext(GameContext);
};

export const useTriviaJamSharedActor = () => {
  const { sharedCollectionActor } = useGameContext();
  return useSelector(sharedCollectionActor, selectTriviaJamSharedActor);
};

export const useSharedCollectionActor = () => {
  const { sharedCollectionActor } = useGameContext();
  return sharedCollectionActor;
};
