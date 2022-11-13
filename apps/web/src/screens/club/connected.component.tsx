import { Box } from '@atoms/Box';
import { useActorLogger } from '../../lib/logging';
import { useClubScreenActor } from './club-screen.hooks';
import { PlayerList } from './player-list.component';

export const ConnectedComponent = () => {
  const clubScreenActor = useClubScreenActor();
  useActorLogger(clubScreenActor);

  return (
    <Box css={{ px: '$3' }}>
      <PlayerList />
    </Box>
  );
};
