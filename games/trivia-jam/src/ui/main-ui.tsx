import { SharedCollectionActor } from '@explorers-club/actor';
import { FC } from 'react';
import { Screens } from '../screens';
import { GameContext } from '../state/game.context';

interface Props {
  sharedCollectionActor: SharedCollectionActor;
}

export const TriviaJamMainUI: FC<Props> = ({ sharedCollectionActor }) => {
  return (
    <GameContext.Provider value={{ sharedCollectionActor }}>
      <Screens />
    </GameContext.Provider>
  );
};
