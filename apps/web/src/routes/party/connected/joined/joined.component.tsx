import { useSelector } from '@xstate/react';
import styled from 'styled-components';
import { usePartyScreenActor } from '../../party-screen.hooks';
import { PlayerList } from '../player-list.component';
import { NotReady } from './not-ready.component';
import { Ready } from './ready.component';

export const Joined = () => {
  const actor = usePartyScreenActor();

  const isReady = useSelector(actor, (state) =>
    state.matches('Connected.Joined.Ready')
  );

  return (
    <Container>
      <h3>Joined!</h3>
      <PlayerList />
      {isReady ? <Ready /> : <NotReady />}
    </Container>
  );
};

const Container = styled.div``;
