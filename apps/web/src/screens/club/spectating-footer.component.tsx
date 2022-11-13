import { FC, useCallback } from 'react';
import { Button } from '@explorers-club/components/atoms/Button';
import { useClubScreenActor } from './club-screen.hooks';
import { ClubScreenEvents } from './club-screen.machine';

export const SpectatingFooter: FC = () => {
  const actor = useClubScreenActor();
  const handlePressJoin = useCallback(() => {
    actor.send(ClubScreenEvents.PRESS_JOIN());
  }, [actor]);

  return (
    <Button fullWidth color="green" size="3" onClick={handlePressJoin}>
      Join
    </Button>
  );
};
