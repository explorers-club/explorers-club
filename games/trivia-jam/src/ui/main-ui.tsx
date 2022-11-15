import { FC } from 'react';
import { GameContext } from '../state/game.context';
import { TriviaJamActor } from '../state';
import { Screens } from '../screens';

interface Props {
  gameActor: TriviaJamActor;
}

export const TriviaJamMainUI: FC<Props> = ({ gameActor }) => {
  // useEffect(() => {
  //   contentfulClient.getEntry('6THg9TlFzbKerSDrniPxL0').then((f) => {
  //     console.log({ f });
  //   });
  // }, []);

  return (
    <GameContext.Provider value={{ gameActor }}>
      <Screens />
    </GameContext.Provider>
  );
};
