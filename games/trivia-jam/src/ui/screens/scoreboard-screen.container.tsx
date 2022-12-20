import { CONTINUE } from '@explorers-club/commands';
import { useRoomStateSelector } from '@explorers-club/utils';
import { useTriviaJamRoom, useIsHost } from '../../state/trivia-jam.hooks';
import { selectPlayers } from '../../state/trivia-jam.selectors';
import { ScoreboardScreenComponent } from './scoreboard-screen.component';

export const ScoreboardScreen = () => {
  const triviaJamRoom = useTriviaJamRoom();
  const players = useRoomStateSelector(triviaJamRoom, selectPlayers);
  const isHost = useIsHost();

  const handlePressNext = () => {
    triviaJamRoom.send(CONTINUE);
  };

  return (
    <ScoreboardScreenComponent
      players={players}
      showNext={isHost}
      onPressNext={handlePressNext}
    />
  );
};
