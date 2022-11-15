import { Box } from '@atoms/Box';
import { useContext } from 'react';
import { GameContext } from '../state/game.context';

export const Screens = () => {
  const { gameActor } = useContext(GameContext);
  console.log({ gameActor });

  return <Box>Trivia Jam Screens</Box>;
};
