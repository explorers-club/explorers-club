import { useContext } from 'react';
import styled from 'styled-components';
import { HomeServiceContext } from './home.service';

export function HomeComponent() {
  const partyService = useContext(HomeServiceContext);
  console.log(partyService);

  return (
    <Container>
      <p>Home</p>
    </Container>
  );
}

const Container = styled.div``;
