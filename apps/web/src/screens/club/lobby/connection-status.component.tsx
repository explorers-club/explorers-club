import { Badge } from '@atoms/Badge';
import { Box } from '@atoms/Box';
import { selectLobbyServerActor } from '@explorers-club/lobby';
import { useSelector } from '@xstate/react';
import { useSharedCollectionActor } from './lobby-screen.hooks';

export const ConnectionStatus = () => {
  const actor = useSharedCollectionActor();
  const server = useSelector(actor, selectLobbyServerActor);

  return (
    <Box css={{ p: '$3' }}>
      {server ? (
        <Badge size="2" variant="green">Connected</Badge>
      ) : (
        <Badge size="2">Not Connected</Badge>
      )}
    </Box>
  );
};
