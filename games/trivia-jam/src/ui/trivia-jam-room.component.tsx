import { useCurrentStates } from '../state/trivia-jam.hooks';
import { PlayScreen } from './screens/play-screen.container';
import { SummaryScreen } from './screens/summary-screen.container';

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
