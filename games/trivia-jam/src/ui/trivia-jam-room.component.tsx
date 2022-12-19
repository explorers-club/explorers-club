import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { PlayScreen } from './play-screen.container';
import { SummaryScreen } from './summary-screen.container';
import { TriviaJamRoomContext } from './trivia-jam-room.context';

export const TriviaJamRoomComponent = () => {
  const { service } = useContext(TriviaJamRoomContext);
  const state = useSelector(service, (state) => state);

  switch (true) {
    case state.matches('Playing'):
      return <PlayScreen />;
    case state.matches('GameOver'):
      return <SummaryScreen />;
    default:
      return null;
  }
};
