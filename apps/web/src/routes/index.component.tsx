import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { ClubMetadata } from '@explorers-club/schema';
import { RoomAvailable } from 'colyseus.js';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  rooms: RoomAvailable<ClubMetadata>[];
}

export const IndexComponent: FC<Props> = ({ rooms }) => {
  const navigate = useNavigate();

  return (
    <Box css={{ p: '$3' }}>
      <Card>
        <Flex css={{ p: '$3' }} direction="column" gap="3">
          <Heading>Open Rooms</Heading>
          {rooms.length ? (
            rooms.map((room) => (
              <Card
                key={room.roomId}
                css={{ p: '$2' }}
                variant="interactive"
                onClick={() => navigate(`/${room.metadata?.clubName}`)}
              >
                <Flex>{room.metadata?.clubName}'s Explorers Club</Flex>
              </Card>
            ))
          ) : (
            <Text>There are no open club rooms.</Text>
          )}
          <Button
            color="primary"
            size="3"
            onClick={() => {
              navigate('/new');
            }}
          >
            Start New Room
          </Button>
        </Flex>
      </Card>
    </Box>
  );
};
