import { Box } from '@atoms/Box';
import { useCallback } from 'react';
import { usePartyScreenActor } from '../party-screen.hooks';
import { PartyScreenEvents } from '../party-screen.machine';
import { PlayerList } from './player-list.component';

export const Spectating = () => {
  const partyScreenActor = usePartyScreenActor();

  const handlePressJoin = useCallback(() => {
    partyScreenActor.send(PartyScreenEvents.PRESS_JOIN());
  }, [partyScreenActor]);

  return (
    <Box>
      <h3>Spectating...</h3>
      <PlayerList />
      <button onClick={handlePressJoin}>Join</button>
    </Box>
  );
};
