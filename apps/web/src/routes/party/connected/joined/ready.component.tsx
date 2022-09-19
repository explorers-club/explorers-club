import { useCallback } from 'react';
import styled from 'styled-components';
import { usePartyScreenActor } from '../../party-screen.hooks';
import { PartyScreenEvents } from '../../party-screen.machine';

export const Ready = () => {
  const partyScreenActor = usePartyScreenActor();

  const handlePressUnready = useCallback(() => {
    partyScreenActor.send(PartyScreenEvents.PRESS_UNREADY());
  }, [partyScreenActor]);

  return (
    <Container>
      <button onClick={handlePressUnready}>Unready</button>
    </Container>
  );
};

const Container = styled.div``;
