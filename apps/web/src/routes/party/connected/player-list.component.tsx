import { PartyPlayerActor } from '@explorers-club/party';
import { useSelector } from '@xstate/react';
import { useActorManager, usePartyActor } from '../party-screen.hooks';
import { PlayerListItem } from './player-list-item.component';

export const PlayerList = () => {
  const partyActor = usePartyActor();
  const actorManager = useActorManager();
  const playerActors = useSelector(partyActor, (state) => {
    return state.context.playerActorIds
      .map((actorId) => actorManager.getActor(actorId))
      .filter((actor) => {
        return actor
      }) as PartyPlayerActor[];
  });

  return (
    <ul>
      {playerActors.map((actor) => (
        <PlayerListItem key={actor.id} actor={actor} />
      ))}
    </ul>
  );
};
