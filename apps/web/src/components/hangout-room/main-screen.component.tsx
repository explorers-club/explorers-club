import { Card } from '@atoms/Card';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Avatar } from '@atoms/Avatar';
import { Heading } from '@atoms/Heading';
import { useHangoutRoom } from './hangout-room.hooks';
import { useEffect, useState } from 'react';

export const MainScreenComponent = () => {
  const room = useHangoutRoom();
  console.log('hi player names', Array.from(room.state.playerNames.values()));

  // TODO pull this in to a re-usable hook
  const [playerNames, setPlayerNames] = useState(
    Array.from(room.state.playerNames.values())
  );

  useEffect(() => {
    room.state.playerNames.onAdd = (value, key) => {
      setPlayerNames(Array.from(room.state.playerNames.values()));
    };
    room.state.playerNames.onChange = (value, key) => {
      setPlayerNames(Array.from(room.state.playerNames.values()));
    };
    room.state.playerNames.onRemove = (value, key) => {
      setPlayerNames(Array.from(room.state.playerNames.values()));
    };
  }, [room.state, setPlayerNames]);

  // const playerNames = Array.from(room.state.playerNames.entries());
  // const [playerNames, setPlayerNames] = useState(room.state.playerNames.values)
  // const playerNames = useMemu(() => {
  //   room.state.listen("playerNames")

  // }, [])

  // Convert to array so we can map
  // const players = useMemo(() => {
  //   const playerNames: string[] = [];
  //   room.state.playerNames.forEach((name) => playerNames.push(name));
  //   console.log(...room.state.playerNames);
  //   return playerNames;
  // }, [room.state.playerNames]);

  return (
    <Flex direction="column" css={{ p: '$3' }}>
      <Heading>
        {room.name} - {room.id}
      </Heading>
      <Flex direction="column" gap="3">
        {playerNames.map((name) => {
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
