import { PartyPlayerActor } from '@explorers-club/party';
import { useSelector } from '@xstate/react';
import { FC } from 'react';

interface Props {
  actor: PartyPlayerActor;
}

export const PlayerListItem: FC<Props> = ({ actor }) => {
  const playerName = useSelector(actor, (state) => state.context.playerName);
  const isConnected = useSelector(actor, (state) =>
    state.matches('Connection.Connected')
  );

  return (
    <div>
      {actor.id} - {playerName} - connected: {isConnected}
    </div>
  );
};
