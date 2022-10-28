import { PartyPlayerEvents } from '@explorers-club/party';
import { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { JoinedContext } from './joined.context';

export const NotReady = () => {
  const { myActor } = useContext(JoinedContext);

  const handlePressReady = useCallback(() => {
    myActor.send(PartyPlayerEvents.PLAYER_READY());
  }, [myActor]);

  return (
    <Container>
      <button onClick={handlePressReady}>Ready Up</button>
    </Container>
  );
};

const Container = styled.div``;
