import { FC } from 'react';
import { Flex } from '@atoms/Flex';
import { RoomAvailable } from 'colyseus.js';
import { Skeleton } from '@atoms/Skeleton';
import { Card } from '@atoms/Card';
import { Text } from '@atoms/Text';
import { Heading } from '@atoms/Heading';
import { ClubMetadata } from '@explorers-club/schema';
import { Button } from '@atoms/Button';
import { useNavigate } from 'react-router-dom';

interface Props {
  rooms: RoomAvailable<ClubMetadata>[];
}

export const IndexComponent: FC<Props> = ({ rooms }) => {
  const navigate = useNavigate();

  return (
    <Flex direction="column" gap="4" css={{ p: '$3', mb: '$4' }}>
      <Heading>Open Rooms</Heading>
      <Flex direction="column" gap="3">
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
    </Flex>
  );
};
