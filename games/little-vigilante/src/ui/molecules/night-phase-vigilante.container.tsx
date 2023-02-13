import { shuffle } from '@explorers-club/utils';
import { useState } from 'react';
import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { selectSidekickPlayerName, selectUnusedRoles } from '../../state/little-vigilante.selectors';
import { NightPhaseVigilanteComponent } from './night-phase-vigilante.component';

export const NightPhaseVigilante = () => {
  const unusedRoles = useLittleVigilanteSelector(selectUnusedRoles);
  const [unusedRole] = useState(shuffle(unusedRoles)[0]);
  const sidekickPlayer = useLittleVigilanteSelector(selectSidekickPlayerName);

  return (
    <NightPhaseVigilanteComponent
      unusedRole={unusedRole}
      sidekickPlayer={sidekickPlayer}
    />
  );
};
