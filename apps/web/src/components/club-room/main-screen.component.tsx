import { Avatar } from '@atoms/Avatar';
import { Badge } from '@atoms/Badge';
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
                {/* {userId === hostUserId <Badge variant='crimson'>Host</Badge>} */}
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Card>
    </Flex>
  );
};
