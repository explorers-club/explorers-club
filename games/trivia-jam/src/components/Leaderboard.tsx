import { Box } from '@atoms/Box';
import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { selectConnectedPlayers } from '../state';
import { GameContext } from '../state/game.context';

export const Leaderboard = () => {
  const { gameActor } = useContext(GameContext);

  const connectedPlayers = useSelector(gameActor, selectConnectedPlayers);

  return (
    <Box>
      Leaderboard
      <ol>
        {connectedPlayers.map((p) => (
          <Box>{p}</Box>
        ))}
      </ol>
    </Box>
  );
};
