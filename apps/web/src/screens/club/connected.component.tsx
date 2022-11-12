import { Card } from '../../components/atoms/Card';
import { Text } from '../../components/atoms/Text';
import { useActorLogger } from '../../lib/logging';
import { useClubScreenActor } from './club-screen.hooks';
import { Container } from './club.styles';
import { PlayerList } from './player-list.component';

export const ConnectedComponent = () => {
  const clubScreenActor = useClubScreenActor();
  useActorLogger(clubScreenActor);

  return (
    <Container>
      <Card variant="interactive">
        <Text>players</Text>
        <PlayerList />
      </Card>
    </Container>
  );
};
