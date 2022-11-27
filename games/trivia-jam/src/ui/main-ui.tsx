import { FC } from 'react';
import { GameContext } from '../state/game.context';
import { Screens } from '../screens';
import {
  ActorType,
  createActorByTypeSelector,
  selectActorRefs,
  SharedCollectionActor,
} from '@explorers-club/actor';
import { useSelector } from '@xstate/react';
import { createSelector } from 'reselect';
import { TriviaJamSharedActor } from '../state';

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
  const sharedGameService = useSelector(
    sharedCollectionActor,
    selectTriviaJamSharedActor
  );

  return (
    <GameContext.Provider value={{ sharedGameService }}>
      <Screens />
    </GameContext.Provider>
  );
};
