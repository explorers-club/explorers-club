import { GameList } from './game-list';
import { Greeting } from './greeting';
import { NewPlayer } from './new-player';

export function HomeScreen() {
  return (
    <>
      <Greeting />
      <GameList />
      <NewPlayer />
    </>
  );
}
