import { PartyPlayerActor } from '@explorers-club/party';
import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { ConnectedContext } from '../../state/connected.context';
import { PlayerListItem } from './player-list-item.component';

export const PlayerList = () => {
  const { actorManager, partyActor } = useContext(ConnectedContext);
  const playerActors = useSelector(partyActor, (state) => {
    return state.context.playerActorIds
      .map((actorId) => actorManager.getActor(actorId))
      .filter((actor) => {
        return actor;
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
