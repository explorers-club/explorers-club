import { shuffle } from '@explorers-club/utils';
import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { selectUnusedRoles } from '../../state/little-vigilante.selectors';
import { NightPhaseVigilanteComponent } from './night-phase-vigilante.component';

export const NightPhaseVigilante = () => {
  const unusedRoles = useLittleVigilanteSelector(selectUnusedRoles);
  const unusedRole = shuffle(unusedRoles)[0];
  return <NightPhaseVigilanteComponent unusedRole={unusedRole} />;
};
