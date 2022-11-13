import { Box } from '@atoms/Box';
import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectPlayerName } from '../../../state/auth.selectors';
import { GlobalStateContext } from '../../../state/global.provider';

export const Greeting = () => {
  const { authActor } = useContext(GlobalStateContext);
  const playerName = useSelector(authActor, selectPlayerName);

  return (
    <Box css={{ p: '$3' }}>
      Welcome Back{playerName ? `, ${playerName}` : ''}
    </Box>
  );
};
