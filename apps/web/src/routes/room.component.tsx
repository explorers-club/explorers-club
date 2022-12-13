import React, { FC } from 'react';
import { Flex } from '@atoms/Flex';
import { Room } from 'colyseus.js';
import { Heading } from '@atoms/Heading';
import { Skeleton } from '@atoms/Skeleton';

interface Props {
  room?: Room<unknown>;
}

export const RoomComponent: FC<Props> = ({ room }) => {
  return (
    <Flex>
      <Heading>
        {room ? (
          <>
            {room.name} - {room.id}
          </>
        ) : (
          <Skeleton />
        )}
      </Heading>
    </Flex>
  );
};
