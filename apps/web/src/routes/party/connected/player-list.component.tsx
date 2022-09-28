import { useSelector } from '@xstate/react';
import { usePartyActor } from '../party-screen.hooks';

export const PlayerList = () => {
  const partyActor = usePartyActor();
  const actorIds = useSelector(
    partyActor,
    (state) => state.context.playerActorIds
  );
  console.log({ partyActor, actorIds });

  return (
    <ul>
      {actorIds.map((id) => (
        <li key={id}>{id}</li>
      ))}
    </ul>
  );
};
