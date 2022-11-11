import { PartyPlayerEvents } from '@explorers-club/party';
import { Box } from '../../../../components/atoms/Box';
import { useCallback, useContext } from 'react';
import { JoinedContext } from './joined.context';

export const Ready = () => {
  const { myActor } = useContext(JoinedContext);

  const handlePressUnready = useCallback(() => {
    myActor.send(PartyPlayerEvents.PLAYER_UNREADY());
  }, [myActor]);

  return (
    <Box>
      <button onClick={handlePressUnready}>Unready</button>
    </Box>
  );
};
