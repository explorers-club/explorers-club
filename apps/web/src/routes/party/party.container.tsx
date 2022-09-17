import { PartyState } from '@explorers-club/party';
import { useSelector } from '@xstate/react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useActorLogger } from '../../lib/logging';
import { usePartyConnectionActor } from '../../state/party-connection.hooks';
import { PARTY_CONNECTION_EVENTS } from '../../state/party-connection.machine';
import { selectPartyActor } from '../../state/party-connection.selectors';
import { PartyComponent } from './party.component';
import { PartyContext } from './party.context';

export function Party() {
  const partyConnectionActor = usePartyConnectionActor();
  const { code } = useParams();
  const partyActor = useSelector(partyConnectionActor, selectPartyActor);
  useActorLogger(partyActor);

  const isConnecting = useSelector(partyConnectionActor, (state: PartyState) =>
    state.matches('Connecting')
  );

  const hasError = useSelector(partyConnectionActor, (state: PartyState) =>
    state.matches('Error')
  );

  useEffect(() => {
    if (code) {
      partyConnectionActor.send(PARTY_CONNECTION_EVENTS.CONNECT(code));
    }
  }, [partyConnectionActor, code]);

  return (
    <Container>
      {isConnecting && <Connecting />}
      {hasError && <Error />}

      {partyActor && (
        <PartyContext.Provider value={partyActor}>
          <PartyComponent />
        </PartyContext.Provider>
      )}
    </Container>
  );
}

const Container = styled.div``;

const Error = () => {
  return <div>Error</div>;
};

const Connecting = () => {
  return <h3>Connecting...</h3>;
};
