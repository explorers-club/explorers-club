import { ScoreboardScreenComponent } from './scoreboard-screen.component';
import { useMyUserId, useTriviaJamRoom } from './trivia-jam-room.hooks';
import { useRoomStateSelector } from '@explorers-club/utils';
import { selectPlayers, selectHostUserId } from './trivia-jam-room.selectors';
import { CONTINUE } from '@explorers-club/commands';

export const ScoreboardScreen = () => {
  const triviaJamRoom = useTriviaJamRoom();
  const myUserId = useMyUserId();

  const players = useRoomStateSelector(triviaJamRoom, selectPlayers);
  const hostUserId = useRoomStateSelector(triviaJamRoom, selectHostUserId);

  const isHost = hostUserId === myUserId;

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
