import { useSelector } from '@xstate/react';
import { usePartyActor } from '../party-screen.hooks';

export const PlayerList = () => {
  const partyActor = usePartyActor();

  const playerIds = useSelector(
    partyActor,
    (state) => state.context.playerUserIds
  );

  return (
    <ul>
      {playerIds.map((id) => (
        <li key={id}>{id}</li>
      ))}
    </ul>
  );
};
