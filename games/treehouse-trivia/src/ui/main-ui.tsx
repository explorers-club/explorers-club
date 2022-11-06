import { ActorManager, ActorType } from '@explorers-club/actor';
import { FC, useMemo } from 'react';
import { Leaderboard } from '../components/Leaderboard';

interface Props {
  actorManager: ActorManager;
}

export const TreehouseTriviaMainUI: FC<Props> = ({ actorManager }) => {
  const gameActor = useMemo(
    () => actorManager.getActorForType(ActorType.TREEHOUSE_TRIVIA_ACTOR),
    [actorManager]
  );
  const playerActors = useMemo(
    () =>
      actorManager.getActorsForType(ActorType.TREEHOUSE_TRIVIA_PLAYER_ACTOR),
    [actorManager]
  );
  console.log({ gameActor, playerActors });
  return (
    <div>
      <h2>Welcome to treehouse Trivia!</h2>
      <Leaderboard />
    </div>
  );
};
