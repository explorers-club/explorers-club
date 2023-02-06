import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { selectVigilantePlayerName } from '../../state/little-vigilante.selectors';
import { NightPhaseButlerComponent } from './night-phase-butler.component';

export const NightPhaseButler = () => {
  const vigilante = useLittleVigilanteSelector(selectVigilantePlayerName);
  return <NightPhaseButlerComponent vigilante={vigilante} />;
};
