import { Button } from '@atoms/Button';
import { Flex } from '@atoms/Flex';
import { useCallback } from 'react';
import { useClubScreenActor } from '../club-screen.hooks';
import { ClubScreenEvents } from '../club-screen.machine';

export const JoinPartyComponent = () => {
  const clubScreenActor = useClubScreenActor();

  const handlePressJoin = useCallback(() => {
    clubScreenActor.send(ClubScreenEvents.PRESS_JOIN());
  }, [clubScreenActor]);

  return (
    <Flex css={{ px: '$3' }}>
      <Button color="blue" size="3" fullWidth onClick={handlePressJoin}>
        Join
      </Button>
    </Flex>
  );
};
