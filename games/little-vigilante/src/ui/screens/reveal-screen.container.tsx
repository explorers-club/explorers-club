import { CONTINUE, LittleVigilanteStateSerialized } from '@explorers-club/room';
import { useCallback } from 'react';
import { Role } from '../../meta/little-vigilante.constants';
import {
  useIsHost,
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
} from '../../state/little-vigilante.hooks';
import { RevealScreenComponent } from './reveal-screen.component';

export const RevealScreen = () => {
  const isHost = useIsHost();
  const send = useLittleVigilanteSend();

  const onPressNext = useCallback(() => {
    send({ type: CONTINUE });
  }, [send]);

  const playerOutcomes = useLittleVigilanteSelector(selectPlayerOutcomes);

  return (
    <RevealScreenComponent
      onPressNext={isHost ? onPressNext : undefined}
      playerOutcomes={playerOutcomes}
    />
  );
};

const selectPlayerOutcomes = (state: LittleVigilanteStateSerialized) => {
  return Object.entries(state.currentRoundRoles).map(([userId, role]) => ({
    playerName: state.players[userId].name,
    role: role as Role,
    winner: state.currentRoundPoints[userId] === 1,
  }));
};
