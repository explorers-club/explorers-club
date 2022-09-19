import styled from 'styled-components';
import { PlayerList } from './player-list.component';

export const Joined = () => {
  return (
    <Container>
      <h3>Joined!</h3>
      <PlayerList />
    </Container>
  );
};

const Container = styled.div``;
