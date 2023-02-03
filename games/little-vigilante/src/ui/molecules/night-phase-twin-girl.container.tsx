import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { selectTwinBoyPlayerName } from '../../state/little-vigilante.selectors';
import { NightPhaseTwinGirlComponent } from './night-phase-twin-girl.component';

export const NightPhaseTwinGirl = () => {
  const twinBoyPlayer = useLittleVigilanteSelector(selectTwinBoyPlayerName);
  return <NightPhaseTwinGirlComponent twinBoyPlayer={twinBoyPlayer} />;
};
