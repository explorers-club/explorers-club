import { Box } from '@atoms/Box';
import { useFooter } from '../../../state/footer.hooks';
import { memo, useCallback } from 'react';
import { Button } from '@atoms/Button';
import { useClubScreenActor } from '../club-screen.hooks';

export const GameScreen = memo(() => {
  useFooter(<GameFooter />);
  return <Box>Game</Box>;
});

const GameFooter = () => {
  const actor = useClubScreenActor();
  const handlePress = useCallback(() => {
    actor.send('PRESS_JOIN');
  }, [actor]);
  return (
    <Button size="3" color="blue" fullWidth onClick={handlePress}>
      Tap tap
    </Button>
  );
};