import { Caption } from '~/web/components/atoms/Caption';
import { Card } from '../../components/atoms/Card';
import { useActorLogger } from '../../lib/logging';
import { useClubScreenActor } from './club-screen.hooks';
import { Container } from './club.styles';
import { PlayerList } from './player-list.component';

export const ConnectedComponent = () => {
  const clubScreenActor = useClubScreenActor();
  useActorLogger(clubScreenActor);

  return (
    <Container>
      <Card css={{ p: '$3' }}>
        <Caption>players</Caption>
        <PlayerList />
      </Card>
    </Container>
  );
};
