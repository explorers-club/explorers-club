import { Card } from '@atoms/Card';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Avatar } from '@atoms/Avatar';
import { Heading } from '@atoms/Heading';
import { useHangoutRoom } from './hangout-room.hooks';
import { useMemo } from 'react';

export const MainScreenComponent = () => {
  const room = useHangoutRoom();
  console.log('hi player names', room.state.playerNames);

  // Convert to array so we can map
  const players = useMemo(() => {
    const playerNames: string[] = [];
    console.log(room.state.playerNames);
    room.state.playerNames.forEach((name) => playerNames.push(name));
    return playerNames;
  }, [room.state.playerNames]);

  return (
    <Flex direction="column" css={{ p: '$3' }}>
      <Heading>
        {room.name} - {room.id}
      </Heading>
      <Flex direction="column" gap="3">
        {players.map((name) => {
          return (
            <Card css={{ p: '$3' }} key={name}>
              <Flex>
                <Avatar size="4" fallback={name[0]} />
                <Caption>{name}</Caption>
              </Flex>
            </Card>
          );
        })}
      </Flex>
    </Flex>
  );
};
