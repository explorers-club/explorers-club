import { useCallback } from 'react';
import { Button } from '../../components/atoms/Button';
import { Text } from '../../components/atoms/Text';
import { useClubScreenActor } from './club-screen.hooks';
import { ClubScreenEvents } from './club-screen.machine';
import { Container } from './club.styles';
import { PlayerList } from './player-list.component';

export const ConnectedComponent = () => {
  const clubScreenActor = useClubScreenActor();
  const handlePressJoin = useCallback(() => {
    clubScreenActor.send(ClubScreenEvents.PRESS_JOIN());
  }, [clubScreenActor]);

  return (
    <Container>
      <Text>Spectating</Text>
      <PlayerList />
      <Button onClick={handlePressJoin}>Join Party</Button>
    </Container>
  );
};
