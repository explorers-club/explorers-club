import { Box } from '@atoms/Box';
import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectConnectedPlayers } from '../state';

export const Leaderboard = () => {
  // const connectedPlayers = useSelector(gameActor, selectConnectedPlayers);

  return (
    <Box>
      Leaderboard
      <ol>
        {/* {connectedPlayers.map((p) => (
          <Box>{p}</Box>
        ))} */}
      </ol>
    </Box>
  );
};
