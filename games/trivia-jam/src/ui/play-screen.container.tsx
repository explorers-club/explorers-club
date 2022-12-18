import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { QuestionScreen } from './question-screen.container';
import { ScoreboardScreen } from './scoreboard-screen.container';
import { TriviaJamRoomContext } from './trivia-jam-room.context';

export const PlayScreen = () => {
  const service = useContext(TriviaJamRoomContext);
  const state = useSelector(service, (state) => state);

  switch (true) {
    case state.matches('Playing.AwaitingQuestion'):
      return <ScoreboardScreen />;
    case state.matches('Playing.Question'):
      return <QuestionScreen />;
    default:
      return null;
  }
};
