import { Box } from '@atoms/Box';
import { useSelector } from '@xstate/react';
import { memo } from 'react';
import { useClubScreenActor } from '../club-screen.hooks';
import { selectLobbyScreenActor } from '../club-screen.selectors';

export const LobbyScreen = memo(() => {
  const actor = useClubScreenActor();
  const lobbyActor = useSelector(actor, selectLobbyScreenActor);
  console.log({ lobbyActor });
  return <Box>Lobby</Box>;
});
