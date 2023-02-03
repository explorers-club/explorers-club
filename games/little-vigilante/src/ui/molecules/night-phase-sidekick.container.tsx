import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { selectVigilantePlayerName } from '../../state/little-vigilante.selectors';
import { NightPhaseSidekickComponent } from './night-phase-sidekick.component';

export const NightPhaseSidekick = () => {
  const vigilante = useLittleVigilanteSelector(selectVigilantePlayerName);
  return <NightPhaseSidekickComponent vigilante={vigilante} />;
};
