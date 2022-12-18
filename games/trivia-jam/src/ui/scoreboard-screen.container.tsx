import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { ScoreboardScreenComponent } from './scoreboard-screen.component';
import { useTriviaJamRoom } from './trivia-jam-room.hooks';
import { useRoomStateSelector } from '@explorers-club/utils';

// function useStateSelector = (prop: string, selector: ((...args: any[]) => any))

export const ScoreboardScreen = () => {
  const triviaJamRoom = useTriviaJamRoom();

  // useEffect(() => {
  //   console.log(triviaJamRoom.state.players.values());
  //   triviaJamRoom.state.listen('players', (value, previousValue) => {
  //     console.log({ value, previousValue });
  //   });
  // }, []);

  // triviaJamRoom.state.players
  // const players = useMapValues(triviaJamRoom.state.players);

  const players = useRoomStateSelector(triviaJamRoom, selectPlayers);
  console.log(players.length, triviaJamRoom.state.players.values());

  return <ScoreboardScreenComponent players={players} />;
};

const selectPlayers = (state: TriviaJamState) => {
  return Array.from(state.players.values());
};
