import { PartyActor } from '@explorers-club/party';
import { useSelector } from '@xstate/react';
import { Text } from '../../components/atoms/Text';
import { ConnectedContext } from '../../state/connected.context';
import { useClubScreenActor } from './club-screen.hooks';
import { Container } from './club.styles';
import { PlayerList } from './player-list.component';

export const Connected = () => {
  const clubScreenActor = useClubScreenActor();
  const partyActor = useSelector(
    clubScreenActor,
    (state) => state.context.partyActor as PartyActor
  );
  const actorManager = useSelector(
    clubScreenActor,
    (state) => state.context.actorManager
  );

  return (
    <Container>
      <ConnectedContext.Provider value={{ actorManager, partyActor }}>
        <Text>connected</Text>
        <PlayerList />
      </ConnectedContext.Provider>
    </Container>
  );
};
