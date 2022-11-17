import { Box } from '@atoms/Box';
import { useSelector } from '@xstate/react';
import { useActorLogger } from '../../../lib/logging';
import { memo } from 'react';
import { useClubScreenActor } from '../club-screen.hooks';
import { selectUnclaimedScreenActor } from '../club-screen.selectors';

export const UnclaimedScreen = memo(() => {
  const actor = useClubScreenActor();
  const unclaimedActor = useSelector(actor, selectUnclaimedScreenActor);
  useActorLogger(unclaimedActor);
  return <Box>Unclaimed</Box>;
});
