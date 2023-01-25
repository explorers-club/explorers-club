import { shuffle } from '@explorers-club/utils';
import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { selectUnusedRoles } from '../../state/little-vigilante.selectors';
import { NightPhaseVigilanteScreenComponent } from './night-phase-vigilante-screen.component';

export const NightPhaseVigilanteScreen = () => {
  const unusedRoles = useLittleVigilanteSelector(selectUnusedRoles);
  const unusedRole = shuffle(unusedRoles)[0]
  return <NightPhaseVigilanteScreenComponent unusedRole={unusedRole} />;
};
