import { PartyEvents, PartyPlayerActor } from '@explorers-club/party';
import { useSelector } from '@xstate/react';
import { FC, useCallback } from 'react';
import { usePartyActor } from '../party-screen.hooks';

interface Props {
  actor: PartyPlayerActor;
}

export const PlayerListItem: FC<Props> = ({ actor }) => {
  const actorId = actor.id;
  const partyActor = usePartyActor();
  const hostActorId = useSelector(
    partyActor,
    (state) => state.context.hostActorId
  );

  const iAmHost = false; // todo get my actor id from auth
  const actorIsNotHost = hostActorId !== actorId;
  const showRemoveButton = iAmHost && actorIsNotHost;

  const name = useSelector(actor, (state) => state.context.playerName);
  const isReady = useSelector(actor, (state) => !!state.matches('Ready.Yes'));
  const isConnected = useSelector(
    actor,
    (state) => !!state.matches('Connected.Yes')
  );

  const handleRemove = useCallback(() => {
    partyActor.send(PartyEvents.PLAYER_REMOVE({ actorId }));
  }, [partyActor, actorId]);

  return (
    <div>
      {name} - ready: {isReady ? 'Yes' : 'No'} - connected:{' '}
      {isConnected ? 'Yes' : 'No'}
      {showRemoveButton && <button onClick={handleRemove}>remove</button>}
    </div>
  );
};
