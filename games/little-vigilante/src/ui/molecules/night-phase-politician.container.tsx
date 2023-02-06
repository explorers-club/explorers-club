import { useCallback } from 'react';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId,
} from '../../state/little-vigilante.hooks';
import { selectPlayersWithNameAndRole } from '../../state/little-vigilante.selectors';
import { NightPhasePoliticianComponent } from './night-phase-politician.component';

export const NightPhasePolitician = () => {
  const send = useLittleVigilanteSend();
  const myUserId = useMyUserId();

  const handleSelectPlayer = useCallback(
    (userId: string) => {
      send({ type: 'SWAP', firstUserId: myUserId, secondUserId: userId });
    },
    [send, myUserId]
  );

  const players = useLittleVigilanteSelector(
    selectPlayersWithNameAndRole
  ).filter((player) => player.userId !== myUserId);

  return (
    <NightPhasePoliticianComponent
      onSelectPlayer={handleSelectPlayer}
      players={players}
    />
  );
};
