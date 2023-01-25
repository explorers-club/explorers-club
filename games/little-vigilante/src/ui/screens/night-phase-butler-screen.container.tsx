import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { selectVigilantePlayerName } from '../../state/little-vigilante.selectors';
import { NightPhaseButlerScreenComponent } from './night-phase-butler-screen.component';

export const NightPhaseButlerScreen = () => {
  const vigilante = useLittleVigilanteSelector(selectVigilantePlayerName);
  return <NightPhaseButlerScreenComponent vigilante={vigilante} />;
};
