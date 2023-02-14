import { CONTINUE, LittleVigilanteStateSerialized } from '@explorers-club/room';
import { useCallback } from 'react';
import { Role } from '../../../meta/little-vigilante.constants';
import {
  useIsHost,
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId,
} from '../../../state/little-vigilante.hooks';
import { RoleRevealComponent } from './role-reveal.component';

export const RoleReveal = () => {
  const isHost = useIsHost();
  const send = useLittleVigilanteSend();

  const onPressNext = useCallback(() => {
    send({ type: CONTINUE });
  }, [send]);
  const myUserId = useMyUserId();

  const playerOutcomes = useLittleVigilanteSelector(selectPlayerOutcomes);
  const myWinState = useLittleVigilanteSelector((state) => {
    return state.currentRoundPoints[myUserId] > 0;
  });

  return (
    <RoleRevealComponent
      onPressNext={isHost ? onPressNext : undefined}
      myWinState={myWinState}
      playerOutcomes={playerOutcomes}
    />
  );
};

const selectPlayerOutcomes = (state: LittleVigilanteStateSerialized) => {
  return Object.entries(state.currentRoundRoles).map(([userId, role]) => ({
    playerName: state.players[userId].name,
    role: role as Role,
    winner: state.currentRoundPoints[userId] === 1,
    slotNumber: state.players[userId].slotNumber,
    userId,
  }));
};
