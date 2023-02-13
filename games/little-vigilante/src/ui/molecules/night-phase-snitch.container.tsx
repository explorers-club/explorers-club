import { useCallback } from 'react';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId
} from '../../state/little-vigilante.hooks';
import { selectPlayers } from '../../state/little-vigilante.selectors';
import { NightPhaseSnitchComponent } from './night-phase-snitch.component';

export const NightPhaseSnitch = () => {
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
    <NightPhaseSnitchComponent
      onSelectPlayers={handleSelectPlayers}
      players={players}
    />
  );
};
