import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { NightPhaseScreenComponent } from './night-phase-screen.component';

export const NightPhaseScreen = () => {
  useLittleVigilanteSelector((state) => state.players);
  return <NightPhaseScreenComponent />;
};
