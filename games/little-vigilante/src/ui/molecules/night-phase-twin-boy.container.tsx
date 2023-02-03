import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { selectTwinGirlPlayerName } from '../../state/little-vigilante.selectors';
import { NightPhaseTwinGirlComponent } from './night-phase-twin-girl.component';

export const NightPhaseTwinBoy = () => {
  const twinGirlPlayer = useLittleVigilanteSelector(selectTwinGirlPlayerName);
  return <NightPhaseTwinGirlComponent twinBoyPlayer={twinGirlPlayer} />;
};
