import { Box } from '@atoms/Box';
import { useContext } from 'react';
import { AppContext } from '../../state/app.context';
import { GameTabComponent } from './game-tab.component';

export const GameTab = () => {
  const { gameTabActor } = useContext(AppContext);
  return (
    <Box css={{ height: '90vh' }}>
      <GameTabComponent actor={gameTabActor} />;
    </Box>
  );
};
