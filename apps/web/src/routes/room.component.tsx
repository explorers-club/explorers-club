import { FC } from 'react';
import { Flex } from '@atoms/Flex';
import { Room } from 'colyseus.js';
import { Heading } from '@atoms/Heading';
import { Skeleton } from '@atoms/Skeleton';
import { HangoutState } from '@explorers-club/schema';
import { Button } from '@atoms/Button';

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
    <Flex direction="column">
      {room ? (
        <>
          <Heading>
            {room.name} - {room.id}
          </Heading>
          <Button>Join</Button>
        </>
      ) : (
        <Skeleton />
      )}
    </Flex>
  );
};
