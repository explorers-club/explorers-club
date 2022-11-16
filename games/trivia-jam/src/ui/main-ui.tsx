import { FC } from 'react';
import { GameContext } from '../state/game.context';
import { TriviaJamActor } from '../state';
import { Screens } from '../screens';

interface Props {
  gameActor: TriviaJamActor;
}

export const TriviaJamMainUI: FC<Props> = ({ gameActor }) => {
  return (
    <GameContext.Provider value={{ gameActor }}>
      <Screens />
    </GameContext.Provider>
  );
};
