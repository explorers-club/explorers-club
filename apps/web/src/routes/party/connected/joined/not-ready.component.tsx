import { PartyPlayerEvents } from '@explorers-club/party';
import { useCallback, useContext } from 'react';
import { Box } from '@atoms/Box';
import { JoinedContext } from './joined.context';

export const NotReady = () => {
  const { myActor } = useContext(JoinedContext);

  const handlePressReady = useCallback(() => {
    myActor.send(PartyPlayerEvents.PLAYER_READY());
  }, [myActor]);

  return (
    <Box>
      <button onClick={handlePressReady}>Ready Up</button>
    </Box>
  );
};
