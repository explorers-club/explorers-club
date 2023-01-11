import { CONTINUE } from '@explorers-club/room';
import { useCallback } from 'react';
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

  const playerRoles = useLittleVigilanteSelector((state) =>
    Object.entries(state.currentRoundRoles).map(
      ([userId, role]) => [state.players[userId].name, role] as const
    )
  );

  return (
    <RevealScreenComponent
      onPressNext={isHost ? onPressNext : undefined}
      playerRoles={playerRoles}
    />
  );
};
