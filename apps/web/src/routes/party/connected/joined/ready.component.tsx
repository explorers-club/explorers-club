import { PartyPlayerEvents } from '@explorers-club/party';
import { useCallback, useContext } from 'react';
import styled from 'styled-components';
import { JoinedContext } from './joined.context';

export const Ready = () => {
  const { myActor } = useContext(JoinedContext);

  const handlePressUnready = useCallback(() => {
    myActor.send(PartyPlayerEvents.NOT_READY());
  }, [myActor]);

  return (
    <Container>
      <button onClick={handlePressUnready}>Unready</button>
    </Container>
  );
};

const Container = styled.div``;
