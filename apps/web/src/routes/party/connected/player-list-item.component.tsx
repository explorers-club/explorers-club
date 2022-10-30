import { PartyPlayerActor } from '@explorers-club/party';
import { useSelector } from '@xstate/react';
import { FC } from 'react';

interface Props {
  actor: PartyPlayerActor;
}

export const PlayerListItem: FC<Props> = ({ actor }) => {
  const name = useSelector(actor, (state) => state.context.playerName);
  const isReady = useSelector(actor, (state) => !!state.matches('Ready.Yes'));
  const isConnected = useSelector(
    actor,
    (state) => !!state.matches('Connected.Yes')
  );

  return (
    <div>
      {name} - ready: {isReady ? 'Yes' : 'No'} - connected:{' '}
      {isConnected ? 'Yes' : 'No'}
    </div>
  );
};
