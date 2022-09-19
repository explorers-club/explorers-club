import styled from 'styled-components';
import { Connected } from './connected';
import { Connecting } from './connecting.component';
import { Disconnected } from './disconnected.container';
import { usePartyScreenState } from './party-screen.hooks';

export function PartyScreen() {
  const state = usePartyScreenState();

  return (
    <Container>
      {state.matches('Connecting') && <Connecting />}
      {state.matches('Disconnected') && <Disconnected />}
      {state.matches('Connected') && <Connected />}
    </Container>
  );
}

const Container = styled.div``;
