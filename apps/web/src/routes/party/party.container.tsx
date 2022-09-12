import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useParty,
  usePartyConnection,
} from '../../state/party-connection.hooks';
import { PARTY_CONNECTION_EVENTS } from '../../state/party-connection.machine';
import { useSelector } from '@xstate/react';
import { useActorLogger } from '../../lib/logging';

export function Party() {
  const partyConnection = usePartyConnection();
  const party = useParty();
  useActorLogger(party);
  const { code } = useParams();

  // const hasNameSet =

  const isConnecting = useSelector(partyConnection, (state) =>
    state.matches('Connecting')
  );

  const isConnected = useSelector(partyConnection, (state) =>
    state.matches('Connected')
  );

  const hasError = useSelector(partyConnection, (state) =>
    state.matches('Error')
  );

  useEffect(() => {
    if (code) {
      partyConnection.send(PARTY_CONNECTION_EVENTS.CONNECT(code));
    }
  }, [partyConnection, code]);

  if (isConnecting) {
    return <Connecting />;
  }

  if (hasError) {
    return <Error />;
  }

  if (isConnected) {
    return <PlayerList />;
  }

  return <></>;
}

const Error = () => {
  return <div>Error</div>;
};

const Connecting = () => {
  return <h3>Connecting...</h3>;
};

const PlayerList = () => {
  return (
    <ul>
      <li>Jimmy</li>
      <li>Ted</li>
    </ul>
  );
};
