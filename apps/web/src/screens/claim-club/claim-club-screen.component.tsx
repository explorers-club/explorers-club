import { Box } from '@atoms/Box';
import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { ClaimClubContext } from './claim-club.context';

export const ClaimClubScreen = () => {
  const { actor } = useContext(ClaimClubContext);
  const playerName = useSelector(actor, (state) => state.context.playerName);
  return <Box css={{ p: '$3' }}>Claim {playerName}</Box>;
};
