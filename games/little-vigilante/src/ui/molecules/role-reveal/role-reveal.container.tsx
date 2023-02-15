import { CONTINUE, LittleVigilanteStateSerialized } from '@explorers-club/room';
import { useCallback } from 'react';
import { Role } from '../../../meta/little-vigilante.constants';
import {
  useIsHost,
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
  useMyUserId,
} from '../../../state/little-vigilante.hooks';
import { selectPlayerOutcomes } from '../../../state/little-vigilante.selectors';
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
