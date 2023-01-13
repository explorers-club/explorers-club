import React, { useCallback } from 'react';
import {
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId,
} from '../../state/little-vigilante.hooks';
import { selectPlayersWithNameAndRole } from '../../state/little-vigilante.selectors';
import { NightPhaseDetectiveScreenComponent } from './night-phase-detective-screen.component';

export const NightPhaseDetectiveScreen = () => {
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
    <NightPhaseDetectiveScreenComponent
      onSelectPlayer={handleSelectPlayer}
      players={players}
    />
  );
};
