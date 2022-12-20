import { useRoomStateSelector } from '@explorers-club/utils';
import { useTriviaJamRoom } from '../../state/trivia-jam.hooks';
import { selectPlayers } from '../../state/trivia-jam.selectors';
import { SummaryScreenComponent } from './summary-screen.component';

export const SummaryScreen = () => {
  const triviaJamRoom = useTriviaJamRoom();
  const players = useRoomStateSelector(triviaJamRoom, selectPlayers);

  return <SummaryScreenComponent players={players} />;
};
