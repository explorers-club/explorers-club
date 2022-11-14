import { Box } from '@atoms/Box';
import { usePartyActor } from '../club-screen.hooks';
import { GameSelectComponent } from './game-select.component';

export const GameSelect = () => {
  const partyActor = usePartyActor();
  if (!partyActor) {
    return <Placeholder />;
  }

  return <GameSelectComponent />;
};

const Placeholder = () => <Box />;
