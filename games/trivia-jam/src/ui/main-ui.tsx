import {
  ActorType,
  createActorByTypeSelector,
  SharedCollectionActor,
} from '@explorers-club/actor';
import { useSelector } from '@xstate/react';
import { FC } from 'react';
import { createSelector } from 'reselect';
import { Screens } from '../screens';
import { TriviaJamSharedActor } from '../state';
import { GameContext } from '../state/game.context';

interface Props {
  sharedCollectionActor: SharedCollectionActor;
}

export const selectTriviaJamSharedActor = createSelector(
  createActorByTypeSelector<TriviaJamSharedActor>(
    ActorType.TRIVIA_JAM_SHARED_ACTOR
  ),
  (actors) => actors[0]
);

export const TriviaJamMainUI: FC<Props> = ({ sharedCollectionActor }) => {
  const triviaJamSharedActor = useSelector(
    sharedCollectionActor,
    selectTriviaJamSharedActor
  );

  return (
    <GameContext.Provider
      value={{ triviaJamSharedActor, sharedCollectionActor }}
    >
      <Screens />
    </GameContext.Provider>
  );
};
