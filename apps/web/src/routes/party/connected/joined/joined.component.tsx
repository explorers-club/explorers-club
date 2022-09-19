import styled from 'styled-components';
import { usePartyScreenState } from '../../party-screen.hooks';
import { PlayerList } from '../player-list.component';
import { NotReady } from './not-ready.component';
import { Ready } from './ready.component';

export const Joined = () => {
  const state = usePartyScreenState();

  return (
    <Container>
      <h3>Joined!</h3>
      <PlayerList />
      {state.matches('Connected.Joined.Ready') && <Ready />}
      {state.matches('Connected.Joined.NotReady') && <NotReady />}
    </Container>
  );
};

const Container = styled.div``;
