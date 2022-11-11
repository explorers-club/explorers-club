import { useSelector } from '@xstate/react';
import { useCallback } from 'react';
import { Button } from '../../components/atoms/Button';
import { Text } from '../../components/atoms/Text';
import { useActorLogger } from '../../lib/logging';
import { ConnectedContext } from '../../state/connected.context';
import { useClubScreenActor } from './club-screen.hooks';
import { ClubScreenEvents } from './club-screen.machine';
import { selectActorManager, selectPartyActor } from './club-screen.selectors';
import { Container } from './club.styles';
import { PlayerList } from './player-list.component';

// const selectShowJoin = createSelector(selectIsJoined, selectIs)

export const Connected = () => {
  const clubScreenActor = useClubScreenActor();
  useActorLogger(clubScreenActor);
  const partyActor = useSelector(clubScreenActor, selectPartyActor);
  const actorManager = useSelector(clubScreenActor, selectActorManager);

  const handlePressJoin = useCallback(() => {
    clubScreenActor.send(ClubScreenEvents.PRESS_JOIN());
  }, [clubScreenActor]);

  return (
    <Container>
      <ConnectedContext.Provider value={{ actorManager, partyActor }}>
        <Text>Spectating</Text>
        <PlayerList />
        <Button onClick={handlePressJoin}>Join Party</Button>
      </ConnectedContext.Provider>
    </Container>
  );
};
