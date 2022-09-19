import styled from 'styled-components';
import { usePartyScreenState } from '../party-screen.hooks';
import { JoinError } from './join-error.component';
import { Joined } from './joined';
import { Joining } from './joining.component';
import { Spectating } from './spectating.component';

export const Connected = () => {
  const state = usePartyScreenState();

  return (
    <Container>
      {state.matches('Connected.Spectating') && <Spectating />}
      {state.matches('Connected.Joining') && <Joining />}
      {state.matches('Connected.Joined') && <Joined />}
      {state.matches('Connected.JoinError') && <JoinError />}
    </Container>
  );
};

const Container = styled.div``;
