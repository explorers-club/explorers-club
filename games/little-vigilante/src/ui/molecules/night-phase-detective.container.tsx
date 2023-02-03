import { useCallback } from 'react';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId,
} from '../../state/little-vigilante.hooks';
import { selectPlayersWithNameAndRole } from '../../state/little-vigilante.selectors';
import { NightPhaseDetectiveComponent } from './night-phase-detective.component';

export const NightPhaseDetective = () => {
  const send = useLittleVigilanteSend();
  const myUserId = useMyUserId();
  const handleSelectPlayer = useCallback(() => {
    setTimeout(() => {
      send({ type: 'CONTINUE' });
    }, 3000);
  }, [send]);
  const players = useLittleVigilanteSelector(
    selectPlayersWithNameAndRole
  ).filter((player) => player.userId !== myUserId);
  return (
    <NightPhaseDetectiveComponent
      onSelectPlayer={handleSelectPlayer}
      players={players}
    />
  );
};
