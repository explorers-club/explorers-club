import { CONTINUE } from '@explorers-club/room';
import { useCallback } from 'react';
import {
  useIsHost,
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
} from '../../state/little-vigilante.hooks';
import { ScoreboardScreenComponent } from './scoreboard-screen.component';

export const ScoreboardScreen = () => {
  const isHost = useIsHost();
  const players = useLittleVigilanteSelector((state) =>
    Object.values(state.players)
  );
  const send = useLittleVigilanteSend();

  const onPressNext = useCallback(() => {
    send({ type: CONTINUE });
  }, [send]);

  return (
    <ScoreboardScreenComponent
      onPressNext={isHost ? onPressNext : undefined}
      players={players}
    />
  );
};
