import { useCallback } from 'react';
import { Section } from '../../components/atoms/Section';
import { Text } from '../../components/atoms/Text';
import { useActorLogger } from '../../lib/logging';
import { useClubScreenActor } from './club-screen.hooks';
import { ClubScreenEvents } from './club-screen.machine';
import { Container } from './club.styles';
import { PlayerList } from './player-list.component';

export const ConnectedComponent = () => {
  const clubScreenActor = useClubScreenActor();
  useActorLogger(clubScreenActor);
  const handlePressJoin = useCallback(() => {
    clubScreenActor.send(ClubScreenEvents.PRESS_JOIN());
  }, [clubScreenActor]);

  return (
    <Container>
      <Section>
        <Text>players</Text>
        <PlayerList />
      </Section>
    </Container>
  );
};
