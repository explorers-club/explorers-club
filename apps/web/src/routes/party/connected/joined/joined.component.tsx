import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import styled from 'styled-components';
import { usePartyScreenActor } from '../../party-screen.hooks';
import { PlayerList } from '../player-list.component';
import { JoinedContext } from './joined.context';
import { NotReady } from './not-ready.component';
import { Ready } from './ready.component';

export const Joined = () => {
  const { myActor } = useContext(JoinedContext);
  const isReady = useSelector(myActor, (state) => state.matches('Ready.Yes'));

  return (
    <Container>
      <h3>Joined!</h3>
      <PlayerList />
      {isReady ? <Ready /> : <NotReady />}
    </Container>
  );
};

const Container = styled.div``;
