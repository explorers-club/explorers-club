// import { LobbyActor } from '@explorers-club/party';
import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import styled from 'styled-components';
import { Lobby } from './lobby.component';
import { PartyContext } from './party.context';

export function PartyComponent() {
  const partyActor = useContext(PartyContext);
  const players = useSelector(
    partyActor,
    (state) => state.context.playerActorIds
  );

  console.log({ players });

  return (
    <Container>
      <Lobby />
    </Container>
  );
}

const Container = styled.div``;
