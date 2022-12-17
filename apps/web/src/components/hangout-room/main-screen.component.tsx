import { Avatar } from '@atoms/Avatar';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { HANGOUT_ROOM_START_GAME } from '@explorers-club/commands';
import { useCallback, useEffect, useState } from 'react';
import { useHangoutRoom } from './hangout-room.hooks';

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

  const handlePressStart = useCallback(() => {
    room.send(HANGOUT_ROOM_START_GAME);
  }, [room]);

  // const handleChangeGame = useCallback(
  //   (gameId: string) => {
  //     room.send(HANGOUT_ROOM_SELECT_GAME, { gameId });
  //   },
  //   [room]
  // );

  return (
    <Flex direction="column" css={{ p: '$3' }}>
      <Heading>
        {room.name} - {room.id}
      </Heading>
      <Card css={{ p: '$3' }}>
        <Caption>Playing</Caption>
        <Heading>Trivia Jam</Heading>
        <Button size="3" fullWidth color="primary" onClick={handlePressStart}>
          Start
        </Button>
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
