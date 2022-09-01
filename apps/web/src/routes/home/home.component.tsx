import { useContext } from 'react';
import styled from 'styled-components';
import { HomeServiceContext } from './home.service';

export function HomeComponent() {
  const homeService = useContext(HomeServiceContext);
  console.log(homeService);

  return (
    <Container>
      <p>Home</p>
    </Container>
  );
}

const Container = styled.div``;
