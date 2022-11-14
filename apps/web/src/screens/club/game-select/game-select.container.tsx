import { Box } from '@atoms/Box';
import { useSelector } from '@xstate/react';
import { useClubScreenActor } from '../club-screen.hooks';
import { selectPartyActor } from '../club-screen.selectors';
import { GameSelectComponent } from './game-select.component';

export const GameSelect = () => {
  const clubScreenActor = useClubScreenActor();

  const partyActor = useSelector(clubScreenActor, selectPartyActor);

  if (!partyActor) {
    return <Placeholder />;
  }

  return <GameSelectComponent />;
};

const Placeholder = () => <Box />;
