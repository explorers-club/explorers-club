import { FC } from 'react';
import { Flex } from '@atoms/Flex';
import { RoomAvailable } from 'colyseus.js';
import { Skeleton } from '@atoms/Skeleton';
import { Card } from '@atoms/Card';
import { Heading } from '@atoms/Heading';

interface Props {
  rooms?: RoomAvailable<unknown>[];
}

export const IndexComponent: FC<Props> = ({ rooms }) => {
  return (
    <Flex direction="column" gap="4">
      <Heading>Open Games</Heading>
      <Flex direction="column" gap="3">
        {rooms ? (
          rooms.map((room) => (
            <Card
              as="a"
              href={`/${room.roomId}`}
              key={room.roomId}
              css={{ p: '$2' }}
              variant="interactive"
            >
              <Flex>{room.roomId}</Flex>
            </Card>
          ))
        ) : (
          <Skeleton />
        )}
      </Flex>
    </Flex>
  );
};
