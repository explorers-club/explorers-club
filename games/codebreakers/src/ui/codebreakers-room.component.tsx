import { useCodebreakersSelector } from '../state/codebreakers.hooks';
import { ChooseTeamsScreen } from './screens/choose-teams-screen.container';
import { PlayScreen } from './screens/play-screen.container';
import { SummaryScreen } from './screens/summary-screen.container';

export const CodebreakersRoomComponent = () => {
  const states = useCodebreakersSelector((state) => state.currentStates);

  switch (true) {
    case states.includes('ChooseTeams'):
      return <ChooseTeamsScreen />;
    case states.includes('Playing'):
      return <PlayScreen />;
    case states.includes('GameOver'):
      return <SummaryScreen />;
    default:
      return null;
  }
};
