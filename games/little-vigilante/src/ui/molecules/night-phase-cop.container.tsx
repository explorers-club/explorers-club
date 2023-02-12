import { useCallback } from 'react';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId
} from '../../state/little-vigilante.hooks';
import { selectPlayers } from '../../state/little-vigilante.selectors';
import { NightPhaseCopComponent } from './night-phase-cop.component';

export const NightPhaseCop = () => {
  const send = useLittleVigilanteSend();
  const myUserId = useMyUserId();
  const handleSelectPlayer = useCallback(
    (userId: string) => {
      send({ type: 'ARREST', arrestedUserId: userId });
    },
    [send]
  );

  const players = useLittleVigilanteSelector(selectPlayers).filter(
    (player) => player.userId !== myUserId
  );

  return (
    <NightPhaseCopComponent
      players={players}
      onSelectPlayer={handleSelectPlayer}
    />
  );
};
