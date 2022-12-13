import { FC, useEffect } from 'react';
import { Flex } from '@atoms/Flex';
import { Room } from 'colyseus.js';
import { Heading } from '@atoms/Heading';
import { Skeleton } from '@atoms/Skeleton';
import { HangoutState } from '@explorers-club/schema';

interface Props {
  room?: Room<HangoutState>;
}

export const RoomComponent: FC<Props> = ({ room }) => {
  console.log(room?.state);
  // useEffect(() => {
  //   room &&
  //     room.onStateChange((state) => {
  //       console.log(state);
  //     });

  //   return () => {
  //     room && room.removeAllListeners();
  //   };
  // }, [room]);
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
