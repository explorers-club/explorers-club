import { Avatar } from '@atoms/Avatar';
import { Badge } from '@atoms/Badge';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { IconButton } from '@atoms/IconButton';
import { CLUB_ROOM_START_GAME, useStoreSelector } from '@explorers-club/room';
import { GearIcon } from '@radix-ui/react-icons';
import { useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ClubRoomContext } from './club-room.context';
import { useClubStore, useIsHost } from './club-room.hooks';

export const MainScreenComponent = () => {
  const clubName = useParams()['clubName'];
  const service = useContext(ClubRoomContext);
  const store = useClubStore();
  const isHost = useIsHost();
  const players = useStoreSelector(store, (state) =>
    Object.values(state.players)
  );
  const hostUserId = useStoreSelector(store, (state) => state.hostUserId);

  const handlePressConfigure = useCallback(() => {
    service.send('CONFIGURE');
  }, [service]);

  const handlePressStart = useCallback(() => {
    store.send({ type: CLUB_ROOM_START_GAME });
  }, [store]);

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
            <Flex gap="2">
              <Button
                size="3"
                color="primary"
                onClick={handlePressStart}
                css={{ flex: '1' }}
              >
                Start
              </Button>
              <IconButton size="3" onClick={handlePressConfigure}>
                <GearIcon />
              </IconButton>
            </Flex>
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
