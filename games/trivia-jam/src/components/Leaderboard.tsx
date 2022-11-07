import {
  ActorType,
  getActorId,
  getUniqueId,
  useSelectActors,
} from '@explorers-club/actor';
import { PartyPlayerActor } from '@explorers-club/party';
import { useSelector } from '@xstate/react';
import { FC, useContext, useMemo } from 'react';
import { TriviaJamPlayerActor } from '../state';
import { GameContext } from '../state/game.context';

export const Leaderboard = () => {
  const { actorManager } = useContext(GameContext);
  const gamePlayerActors = useMemo(
    () =>
      actorManager.getActorsForType(ActorType.TREEHOUSE_TRIVIA_PLAYER_ACTOR),
    [actorManager]
  );
  return (
    <ol>
      {gamePlayerActors.map((gamePlayerActor) => {
        const userId = getUniqueId(gamePlayerActor.id);
        const partyPlayerActorId = getActorId(
          ActorType.PARTY_PLAYER_ACTOR,
          userId
        );
        const partyPlayerActor = actorManager.getActor(
          partyPlayerActorId
        ) as PartyPlayerActor;
        console.log(partyPlayerActor, partyPlayerActorId);

        return (
          <LeaderboardPlayer
            key={gamePlayerActor.id}
            partyPlayerActor={partyPlayerActor}
            gamePlayerActor={gamePlayerActor}
          />
        );
      })}
    </ol>
  );
};

interface PlayerProps {
  partyPlayerActor: PartyPlayerActor;
  gamePlayerActor: TriviaJamPlayerActor;
}

const LeaderboardPlayer: FC<PlayerProps> = ({
  partyPlayerActor,
  gamePlayerActor,
}) => {
  const playerName = useSelector(
    partyPlayerActor,
    (state) => state.context.playerName
  );
  return <li>{playerName}</li>;
};
