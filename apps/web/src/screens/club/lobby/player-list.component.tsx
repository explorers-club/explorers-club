import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import {
  LobbyPlayerActor,
  selectLobbyPlayerActors,
} from '@explorers-club/lobby';
import { useSelector } from '@xstate/react';
import { FC, useCallback } from 'react';
import {
  useLobbyScreenActor,
  useSharedCollectionActor,
} from './lobby-screen.hooks';
import { LobbyScreenEvents } from './lobby-screen.machine';
import { selectIsJoined, selectIsSpectating } from './lobby-screen.selectors';

const DEFAULT_LOBBY_DISPLAY_SIZE = 6;

export const PlayerList = () => {
  const actor = useSharedCollectionActor();
  const lobbyScreenActor = useLobbyScreenActor();
  const canJoin = useSelector(lobbyScreenActor, selectIsSpectating);
  const canReady = useSelector(lobbyScreenActor, selectIsJoined);

  const playerActors = useSelector(actor, selectLobbyPlayerActors);
  return (
    <Box css={{ p: '$3', pt: '0' }}>
      <Card css={{ p: '$3' }}>
        <Caption
          css={{ color: '$gray11', textTransform: 'uppercase', mb: '$2' }}
        >
          Party
        </Caption>
        <Flex css={{ mt: '$6', gap: '$4', fd: 'column' }}>
          {Array.from({ length: DEFAULT_LOBBY_DISPLAY_SIZE }).map((_, i) => {
            const actor = playerActors[i];
            if (actor) {
              return <PlayerListItem key={actor.id} actor={actor} />;
            } else {
              return <PlayerListItemPlaceholder key={i} />;
            }
          })}
        </Flex>
        {canJoin && <JoinButton />}
        {canReady && <ReadyButton />}
      </Card>
    </Box>
  );
};

interface ItemProps {
  actor: LobbyPlayerActor;
}

const JoinButton = () => {
  const actor = useLobbyScreenActor();
  const handlePressJoin = useCallback(() => {
    actor.send(LobbyScreenEvents.PRESS_JOIN());
  }, [actor]);

  return (
    <Button size="3" fullWidth onClick={handlePressJoin}>
      Join Party
    </Button>
  );
};

const ReadyButton = () => {
  return (
    <Button size="3" fullWidth>
      Ready
    </Button>
  );
};

const PlayerListItem: FC<ItemProps> = ({ actor }) => {
  //   const playerName = useSelector(actor, selectPlayerName);
  return <Box>1</Box>;
};

const PlayerListItemPlaceholder = () => {
  return <Box>Empty</Box>;
};
