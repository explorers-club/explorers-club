import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import {
  createPlayerActorByUserIdSelector,
  LobbyPlayerActor,
  selectLobbyPlayerActors,
  selectLobbyPlayerIsReady,
  selectLobbyPlayerName,
} from '@explorers-club/lobby';
import { useSelector } from '@xstate/react';
import { FC, useCallback, useMemo } from 'react';
import { useAuthActor } from '../../../state/auth.hooks';
import { selectUserId } from '../../../state/auth.selectors';
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
  const actor = useLobbyScreenActor();
  const authActor = useAuthActor();
  const sharedCollectionActor = useSharedCollectionActor();
  const userId = useSelector(authActor, selectUserId);
  const selectMyLobbyPlayerActor = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => createPlayerActorByUserIdSelector(userId!),
    [userId]
  );
  const playerActor = useSelector(
    sharedCollectionActor,
    selectMyLobbyPlayerActor
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const isReady = useSelector(playerActor!, selectLobbyPlayerIsReady);
  console.log({ playerActor, isReady });

  const handlePressReady = useCallback(() => {
    actor.send(LobbyScreenEvents.PRESS_READY());
  }, [actor]);

  const handlePressUnready = useCallback(() => {
    actor.send(LobbyScreenEvents.PRESS_UNREADY());
  }, [actor]);

  return (
    <Button
      size="3"
      fullWidth
      onClick={isReady ? handlePressUnready : handlePressReady}
    >
      {isReady ? 'Not Ready' : 'Ready'}
    </Button>
  );
};

const PlayerListItem: FC<ItemProps> = ({ actor }) => {
  const playerName = useSelector(actor, selectLobbyPlayerName);
  return <Box>{playerName}</Box>;
};

const PlayerListItemPlaceholder = () => {
  return <Box>Empty</Box>;
};
