import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import {
  selectVigilantePlayerName,
  selectSidekickPlayerName,
} from '../../state/little-vigilante.selectors';
import { NightPhaseButlerComponent } from './night-phase-butler.component';

export const NightPhaseButler = () => {
  const vigilante = useLittleVigilanteSelector(selectVigilantePlayerName);
  const sidekick = useLittleVigilanteSelector(selectSidekickPlayerName);
  return (
    <NightPhaseButlerComponent vigilante={vigilante} sidekick={sidekick} />
  );
};
