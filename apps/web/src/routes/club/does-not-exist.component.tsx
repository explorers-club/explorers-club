import { useSelector } from '@xstate/react';
import { useClubScreenActor } from './club-screen.hooks';
import { selectHostPlayerName } from './club-screen.selectors';
import { Container } from './club.styles';

export const DoesNotExist = () => {
  const actor = useClubScreenActor();
  const playerName = useSelector(actor, selectHostPlayerName);

  return <Container>{playerName}'s Explorers Club doesn't exist yet</Container>;
};
