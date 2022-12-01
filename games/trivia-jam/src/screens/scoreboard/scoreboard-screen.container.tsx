import { ActorType, getActorId, selectActorRefs } from '@explorers-club/actor';
import { useSelector } from '@xstate/react';
import {
  useSharedCollectionActor,
  useTriviaJamSharedActor,
} from '../../state/game.hooks';
import {
  selectPlayerUserIds,
  selectScores,
} from '../../state/trivia-jam-shared.selectors';
import { TriviaJamPlayerActor } from '../../state/types';
import { ScoreboardPlayer } from './scoreboard-player.container';
import { ScoreboardScreenComponent } from './scoreboard-screen.component';

export const ScoreboardScreen = () => {
  const triviaJamSharedActor = useTriviaJamSharedActor();
  const sharedCollectionActor = useSharedCollectionActor();

  const scoresByUserId = useSelector(triviaJamSharedActor, selectScores);
  const userIds = useSelector(triviaJamSharedActor, selectPlayerUserIds);
  const actorRefs = useSelector(sharedCollectionActor, selectActorRefs);

  const actorsRefsByUserId: Record<string, TriviaJamPlayerActor> = {};
  userIds.forEach((userId) => {
    const actorId = getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, userId);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const actor = actorRefs[actorId] as TriviaJamPlayerActor;
    actorsRefsByUserId[userId] = actor;
  });

  return (
    <ScoreboardScreenComponent>
      {userIds.map((userId) => (
        <ScoreboardPlayer
          key={userId}
          actor={actorsRefsByUserId[userId]}
          score={scoresByUserId[userId]}
        />
      ))}
    </ScoreboardScreenComponent>
  );
};
