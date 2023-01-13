import { useCallback } from 'react';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId,
} from '../../state/little-vigilante.hooks';
import { selectPlayersWithName } from '../../state/little-vigilante.selectors';
import { NightPhaseCopScreenComponent } from './night-phase-cop-screen.component';

export const NightPhaseCopScreen = () => {
  const send = useLittleVigilanteSend();
  const myUserId = useMyUserId();
  const handleSelectPlayer = useCallback(
    (userId: string) => {
      send({ type: 'ARREST', arrestedUserId: userId });
    },
    [send]
  );

  const players = useLittleVigilanteSelector(selectPlayersWithName).filter(
    (player) => player.userId !== myUserId
  );

  return (
    <NightPhaseCopScreenComponent
      players={players}
      onSelectPlayer={handleSelectPlayer}
    />
  );
};
