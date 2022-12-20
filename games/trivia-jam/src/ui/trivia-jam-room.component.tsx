import { PlayScreen } from './play-screen.container';
import { SummaryScreen } from './summary-screen.container';
import { useCurrentStates } from '../state/trivia-jam.hooks';

export const TriviaJamRoomComponent = () => {
  const states = useCurrentStates();

  switch (true) {
    case states.includes('Playing'):
      return <PlayScreen />;
    case states.includes('GameOver'):
      return <SummaryScreen />;
    default:
      return null;
  }
};
