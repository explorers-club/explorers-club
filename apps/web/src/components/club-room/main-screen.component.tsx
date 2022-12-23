import { Avatar } from '@atoms/Avatar';
import { Badge } from '@atoms/Badge';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { CLUB_ROOM_START_GAME } from '@explorers-club/commands';
import { useStoreSelector } from '@explorers-club/room';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useClubStore, useIsHost } from './club-room.hooks';

export const MainScreenComponent = () => {
  const clubName = useParams()['clubName'];
  const store = useClubStore();
  const isHost = useIsHost();
  const players = useStoreSelector(store, (state) =>
    Object.values(state.players)
  );
  const hostUserId = useStoreSelector(store, (state) => state.hostUserId);

  const handlePressStart = useCallback(() => {
    store.send({ type: CLUB_ROOM_START_GAME });
  }, [store]);
  console.log({ players, hostUserId });

  return (
    <Flex direction="column" gap="3" css={{ p: '$3' }}>
      <Caption variant="crimson">{clubName}'s Explorers Club</Caption>
      <Card css={{ p: '$3' }}>
        <Flex gap="3" direction="column">
          <Caption>Playing</Caption>
          <Heading>Trivia Jam</Heading>
          <Flex>
            <Badge>Waiting To Start</Badge>
          </Flex>
          {isHost && (
            <Button
              size="3"
              fullWidth
              color="primary"
              onClick={handlePressStart}
            >
              Start
            </Button>
          )}
        </Flex>
      </Card>
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="3">
          {players.map(({ name, userId }) => (
            <Flex
              key={name}
              align="center"
              gap="2"
              css={{ backgroundColor: '$panel2', p: '$3' }}
            >
              <Avatar size="3" fallback={name[0]} />
              <Flex direction="column">
                <Heading size="2">{name}</Heading>
                {userId === hostUserId && <Badge>Host</Badge>}
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Card>
    </Flex>
  );
};
