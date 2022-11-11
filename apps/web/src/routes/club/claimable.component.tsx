import { useSelector } from '@xstate/react';
import { useCallback } from 'react';
import { Box } from '../../components/atoms/Box';
import { useClubScreenActor } from './club-screen.hooks';
import { ClubScreenEvents } from './club-screen.machine';
import { selectHostPlayerName } from './club-screen.selectors';

export const Claimable = () => {
  const actor = useClubScreenActor();
  const playerName = useSelector(actor, selectHostPlayerName);

  const handlePressClaim = useCallback(() => {
    actor.send(ClubScreenEvents.PRESS_CLAIM());
  }, [actor]);

  return (
    <Box>
      <h3>{playerName}'s explorers club is unclaimed</h3>
      <p>Make it yours</p>
      <div>
        <button onClick={handlePressClaim}>Claim '{playerName}'</button>
      </div>
    </Box>
  );
};