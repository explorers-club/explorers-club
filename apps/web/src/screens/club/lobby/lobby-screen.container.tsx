import { Box } from '@atoms/Box';
import { useSelector } from '@xstate/react';
import { useActorLogger } from '../../../lib/logging';
import { memo } from 'react';
import { useClubScreenActor } from '../club-screen.hooks';
import { selectLobbyScreenActor } from '../club-screen.selectors';

export const LobbyScreen = memo(() => {
  const actor = useClubScreenActor();
  const lobbyActor = useSelector(actor, selectLobbyScreenActor);
  useActorLogger(lobbyActor);
  return <Box>Lobby</Box>;
});
