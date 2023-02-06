import { useCallback } from 'react';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId
} from '../../state/little-vigilante.hooks';
import { selectPlayers } from '../../state/little-vigilante.selectors';
import { NightPhaseConspiratorComponent } from './night-phase-conspirator.component';

export const NightPhaseConspirator = () => {
  const send = useLittleVigilanteSend();
  const myUserId = useMyUserId();
  const handleSelectPlayers = useCallback(
    (players: readonly [string, string]) => {
      send({ type: 'SWAP', firstUserId: players[0], secondUserId: players[1] });
    },
    [send]
  );
  const players = useLittleVigilanteSelector(selectPlayers).filter(
    ({ userId }) => userId !== myUserId
  );

  return (
    <NightPhaseConspiratorComponent
      onSelectPlayers={handleSelectPlayers}
      players={players}
    />
  );
};
