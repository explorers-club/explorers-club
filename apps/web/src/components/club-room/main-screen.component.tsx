import { Avatar } from '@atoms/Avatar';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { CLUB_ROOM_START_GAME } from '@explorers-club/commands';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useClubRoom, useIsHost } from './club-room.hooks';

export const MainScreenComponent = () => {
  const clubName = useParams()['clubName'];
  const room = useClubRoom();
  const isHost = useIsHost();

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
    room.send(CLUB_ROOM_START_GAME);
  }, [room]);

  // const handleChangeGame = useCallback(
  //   (gameId: string) => {
  //     room.send(CLUB_ROOM_SELECT_GAME, { gameId });
  //   },
  //   [room]
  // );

  return (
    <Flex direction="column" css={{ p: '$3' }} gap="3">
      <Caption>{clubName}'s Explorers Club</Caption>
      <Card css={{ p: '$3' }}>
        <Flex gap="3" direction="column">
          <Caption>Playing</Caption>
          <Heading>Trivia Jam</Heading>
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
          {players.map(({ name }) => (
            <Flex
              key={name}
              align="center"
              gap="2"
              css={{ backgroundColor: '$panel2', p: '$3' }}
            >
              <Avatar size="4" fallback={name[0]} />
              <Heading>{name}</Heading>
            </Flex>
          ))}
        </Flex>
      </Card>
    </Flex>
  );
};
