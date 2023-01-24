import { useCallback } from 'react';
import { useLittleVigilanteSelector, useLittleVigilanteSend } from '../../state/little-vigilante.hooks';
import { selectPlayers } from '../../state/little-vigilante.selectors';
import { NightPhaseConspiratorScreenComponent } from './night-phase-conspirator-screen.component';

export const NightPhaseConspiratorScreen = () => {
  const send = useLittleVigilanteSend();
  const handleSelectPlayers = useCallback(
    (players: readonly [string, string]) => {
      send({ type: 'SWAP', firstUserId: players[0], secondUserId: players[1] });
    },
    [send]
  );
  const players = useLittleVigilanteSelector(selectPlayers);

  return (
    <NightPhaseConspiratorScreenComponent
      onSelectPlayers={handleSelectPlayers}
      players={players}
    />
  );
};

