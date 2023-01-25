import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { selectVigilantePlayerName } from '../../state/little-vigilante.selectors';
import { NightPhaseSidekickScreenComponent } from './night-phase-sidekick-screen.component';

export const NightPhaseSidekickScreen = () => {
  const vigilante = useLittleVigilanteSelector(selectVigilantePlayerName);
  return <NightPhaseSidekickScreenComponent vigilante={vigilante} />;
};
