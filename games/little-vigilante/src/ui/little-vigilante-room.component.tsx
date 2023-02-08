import { useLittleVigilanteSelector } from '../state/little-vigilante.hooks';
import { PlayScreen } from './screens/play-screen.container';
import { SummaryScreen } from './screens/summary-screen.container';

export const LittleVigilanteRoomComponent = () => {
  const states = useLittleVigilanteSelector((state) => state.currentStates);

  // TODO here define card list by state

  switch (true) {
    case states.includes('Playing'):
      return <PlayScreen />;
    case states.includes('GameOver'):
      return <SummaryScreen />;
    default:
      return null;
  }
};
