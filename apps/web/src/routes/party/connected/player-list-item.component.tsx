import { PartyPlayerActor } from '@explorers-club/party';
import { useSelector } from '@xstate/react';
import { FC } from 'react';

interface Props {
  actor: PartyPlayerActor;
}

export const PlayerListItem: FC<Props> = ({ actor }) => {
  const isReady = useSelector(actor, (state) => !!state.matches('Ready.Yes'));
  const isConnected = useSelector(
    actor,
    (state) => !!state.matches('Connected.Yes')
  );

  return (
    <div>
      {actor.id} - ready: {isReady ? 'Yes' : 'No'} - connected:{' '}
      {isConnected ? 'Yes' : 'No'}
    </div>
  );
};
