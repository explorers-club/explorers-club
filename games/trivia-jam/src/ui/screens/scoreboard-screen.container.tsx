import { CONTINUE } from '@explorers-club/commands';
import { useCallback } from 'react';
import {
  useIsHost,
  useSend,
  useTriviaJamStoreSelector,
} from '../../state/trivia-jam.hooks';
import { selectPlayers } from '../../state/trivia-jam.selectors';
import { ScoreboardScreenComponent } from './scoreboard-screen.component';

export const ScoreboardScreen = () => {
  const players = useTriviaJamStoreSelector(selectPlayers);
  const send = useSend();
  const isHost = useIsHost();

  const handlePressNext = useCallback(() => {
    send({ type: CONTINUE });
  }, [send]);

  return (
    <ScoreboardScreenComponent
      players={players}
      showNext={isHost}
      onPressNext={handlePressNext}
    />
  );
};
