import { FC } from 'react';
import { Leaderboard } from '../components/Leaderboard';
import { TreehouseTriviaPlayerActor } from '../state/treehouse-trivia-player.machine';
import { TreehouseTriviaActor } from '../state/treehouse-trivia.machine';

interface Props {
  gameActor: TreehouseTriviaActor;
  playerActors: TreehouseTriviaPlayerActor;
}

export const MainUI: FC<Props> = ({ gameActor, playerActors }) => {
  return (
    <div>
      <h2>Welcome to treehouse Trivia!</h2>
      <Leaderboard />
    </div>
  );
};
