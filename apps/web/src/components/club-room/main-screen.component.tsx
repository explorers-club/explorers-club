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
import { colorBySlotNumber } from './club-room.constants';
import { ClubRoomContext } from './club-room.context';
import { useClubStore, useIsHost } from './club-room.hooks';
import {
  selectGameConfig,
  selectPlayerBySlotNumber,
} from './club-room.selectors';

export const MainScreenComponent = () => {
  const clubName = useParams()['clubName'];
  const service = useContext(ClubRoomContext);
  const store = useClubStore();
  const isHost = useIsHost();
  const playersBySlotNumber = useStoreSelector(store, selectPlayerBySlotNumber);
  const gameConfig = useStoreSelector(store, selectGameConfig);
  const { maxPlayers } = gameConfig.data;
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
          {Array(maxPlayers)
            .fill(0)
            .map((_, i) => {
              const slotNumber = i + 1;
              const player = playersBySlotNumber[i + 1];

              const isEmpty = !player?.name;
              const name = !isEmpty ? player.name : 'Empty';
              const userId = player?.userId;
              const color = colorBySlotNumber[slotNumber];

              return (
                <Flex
                  key={i}
                  align="center"
                  gap="2"
                  css={{ backgroundColor: '$panel2', p: '$3' }}
                >
                  <Avatar
                    size="3"
                    variant={color}
                    fallback={`P${slotNumber}`}
                  />
                  <Flex direction="column">
                    {player?.name ? (
                      <Heading size="1">{name}</Heading>
                    ) : (
                      <Caption size="2">{name}</Caption>
                    )}
                    {userId === hostUserId && <Badge>Host</Badge>}
                  </Flex>
                </Flex>
              );
            })}
        </Flex>
      </Card>
    </Flex>
  );
};
