import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import styled from 'styled-components';
import { GlobalStateContext } from '../../state/global.provider';
import { Connected, Connecting, Disconnected } from './components';
// import { usePartyConnectionActor } from '../../state/party-connection.hooks';
import { selectPartyScreenActor } from './party-screen.selectors';

export function PartyScreen() {
  const { appActor } = useContext(GlobalStateContext);
  const partyScreenActor = useSelector(appActor, selectPartyScreenActor);
  const state = useSelector(partyScreenActor, (state) => state);

  return (
    <Container>
      {(() => {
        switch (true) {
          case state.matches('Connecting'):
            return <Connecting />;
          case state.matches('Disconnected'):
            return <Disconnected />;
          case state.matches('Connected'):
            return <Connected />;
          default:
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return <></>;
        }
      })()}
    </Container>
  );
}

const Container = styled.div``;

// const handlePressStartGame = useCallback(() => {
//   partyScreenActor.send(PartyScreenEvents.PRESS_START_GAME());
// }, [partyScreenActor]);

// const handlePressReady = useCallback(() => {
//   partyScreenActor.send(PartyScreenEvents.PRESS_READY());
// }, [partyScreenActor]);

// const handlePressUnready = useCallback(() => {
//   partyScreenActor.send(PartyScreenEvents.PRESS_UNREADY());
// }, [partyScreenActor]);

// const handlePressJoin = useCallback(() => {
//   partyScreenActor.send(PartyScreenEvents.PRESS_JOIN());
// }, [partyScreenActor]);
