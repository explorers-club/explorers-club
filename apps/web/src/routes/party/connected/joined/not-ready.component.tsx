import { useCallback } from 'react';
import styled from 'styled-components';
import { usePartyScreenActor } from '../../party-screen.hooks';
import { PartyScreenEvents } from '../../party-screen.machine';

export const NotReady = () => {
  const partyScreenActor = usePartyScreenActor();

  const handlePressReady = useCallback(() => {
    partyScreenActor.send(PartyScreenEvents.PRESS_READY());
  }, [partyScreenActor]);

  return (
    <Container>
      <button onClick={handlePressReady}>Ready Up</button>
    </Container>
  );
};

const Container = styled.div``;
