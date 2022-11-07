import { ActorManager } from '@explorers-club/actor';
import { FC } from 'react';
import { Leaderboard } from '../components/Leaderboard';
import { GameContext } from '../state/game.context';

interface Props {
  actorManager: ActorManager;
}

export const TreehouseTriviaMainUI: FC<Props> = ({ actorManager }) => {
  return (
    <GameContext.Provider value={{ actorManager }}>
      <div>
        <h2>Welcome to treehouse Trivia!</h2>
        <Leaderboard />
      </div>
    </GameContext.Provider>
  );
};
