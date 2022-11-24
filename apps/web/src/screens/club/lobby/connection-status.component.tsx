import { Badge } from '@atoms/Badge';
import { Box } from '@atoms/Box';
import { selectLobbySharedActor } from '@explorers-club/lobby';
import { useSelector } from '@xstate/react';
import { useSharedCollectionActor } from './lobby-screen.hooks';

export const ConnectionStatus = () => {
  const actor = useSharedCollectionActor();
  const shared = useSelector(actor, selectLobbySharedActor);

  return (
    <Box css={{ p: '$3' }}>
      {shared ? (
        <Badge size="2" variant="green">
          Connected
        </Badge>
      ) : (
        <Badge size="2">Not Connected</Badge>
      )}
    </Box>
  );
};
