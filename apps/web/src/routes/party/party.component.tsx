import { useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PartyServiceContext } from './party.service';

export function PartyComponent() {
  const partyService = useContext(PartyServiceContext);
  const { code } = useParams<{ code: string }>();
  console.log(partyService);

  return (
    <Container>
      <p>Party {code}</p>
    </Container>
  );
}

const Container = styled.div``;
