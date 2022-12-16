import { Card } from '@atoms/Card';
import { Caption } from '@atoms/Caption';
import { Text } from '@atoms/Text';
import { Flex } from '@atoms/Flex';
import { Avatar } from '@atoms/Avatar';
import { Heading } from '@atoms/Heading';
import { useHangoutRoom } from './hangout-room.hooks';
import { useEffect, useState, useCallback } from 'react';
import { RadioCard, RadioCardGroup } from '@molecules/RadioCard';
import { HANGOUT_ROOM_SELECT_GAME } from '@explorers-club/commands';

export const MainScreenComponent = () => {
  const room = useHangoutRoom();

  // TODO pull this in to a re-usable hook
  const [players, setPlayers] = useState(
    Array.from(room.state.players.values())
  );

  useEffect(() => {
    room.state.players.onAdd = (value, key) => {
      setPlayers(Array.from(room.state.players.values()));
    };
    room.state.players.onChange = (value, key) => {
      setPlayers(Array.from(room.state.players.values()));
    };
    room.state.players.onRemove = (value, key) => {
      setPlayers(Array.from(room.state.players.values()));
    };
  }, [room.state, setPlayers]);

  const handleChangeGame = useCallback(
    (gameId: string) => {
      room.send(HANGOUT_ROOM_SELECT_GAME, { gameId });
    },
    [room]
  );

  return (
    <Flex direction="column" css={{ p: '$3' }}>
      <Heading>
        {room.name} - {room.id}
      </Heading>
      <Card css={{ p: '$3' }}>
        <Caption>Game</Caption>
        <RadioCardGroup onValueChange={handleChangeGame}>
          <RadioCard value={'trivia_jam'} css={{ mb: '$2', width: '100%' }}>
            <Flex css={{ alignItems: 'center' }}>
              <Avatar shape="square" fallback="TJ" size="6" />
              <Text size="5" css={{ fontWeight: '500', lineHeight: '25px' }}>
                Trivia Jam
              </Text>
            </Flex>
          </RadioCard>
          <RadioCard value={'diffusionary'} css={{ mb: '$2', width: '100%' }}>
            <Flex css={{ alignItems: 'center' }}>
              <Avatar shape="square" fallback="D" size="6" />
              <Text size="5" css={{ fontWeight: '500', lineHeight: '25px' }}>
                Diffusionary
              </Text>
            </Flex>
          </RadioCard>
        </RadioCardGroup>
      </Card>
      <Card css={{ p: '$3' }}>
        <Caption>Players</Caption>
        {players.map(({ name }) => (
          <Flex key={name}>
            <Avatar size="4" fallback={name[0]} />
            <Caption>{name}</Caption>
          </Flex>
        ))}
      </Card>
    </Flex>
  );
};
