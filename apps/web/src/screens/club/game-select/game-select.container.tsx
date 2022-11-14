import { Box } from '@atoms/Box';
import { useSelector } from '@xstate/react';
import { useClubScreenActor } from '../club-screen.hooks';
import { selectPartyActor } from '../club-screen.selectors';

export const GameSelect = () => {
  const clubScreenActor = useClubScreenActor();

  const partyActor = useSelector(clubScreenActor, selectPartyActor);

  if (!partyActor) {
    return <Placeholder />;
  }

  return <Box>Game Select</Box>;
};

const Placeholder = () => <Box />;
