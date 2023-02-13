import { useCallback } from 'react';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId,
} from '../../state/little-vigilante.hooks';
import { NightPhaseConArtistComponent } from './night-phase-con-artist.component';

export const NightPhaseConArtist = () => {
  const send = useLittleVigilanteSend();
  const myUserId = useMyUserId();

  const handleSelectPlayer = useCallback(
    (userId: string) => {
      send({ type: 'SWAP', firstUserId: myUserId, secondUserId: userId });
    },
    [send, myUserId]
  );

  const players = useLittleVigilanteSelector((state) =>
    Object.values(state.players)
  ).filter((player) => player.userId !== myUserId);

  return (
    <NightPhaseConArtistComponent
      onSelectPlayer={handleSelectPlayer}
      players={players}
    />
  );
};
