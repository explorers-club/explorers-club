import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Skeleton } from '@atoms/Skeleton';
import { Text } from '@atoms/Text';
import { TextField } from '@atoms/TextField';
import { HangoutState } from '@explorers-club/schema';
import { Room } from 'colyseus.js';
import { FC, useCallback, useRef } from 'react';

interface Props {
  room?: Room<HangoutState>;
}

export const RoomComponent: FC<Props> = ({ room }) => {
  console.log(room?.state);
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmitName = useCallback(() => {
    room?.send('SET_NAME', nameRef.current?.value);
  }, [nameRef, room]);

  const handleChooseDiffusionary = useCallback(() => {
    room?.send('SET_GAME', 'diffusionary');
  }, [room]);

  const handleChooseTriviaJam = useCallback(() => {
    room?.send('SET_GAME', 'trivia_jam');
  }, [room]);

  return (
    <Flex direction="column">
      {room ? (
        <Flex direction="column" gap="3" css={{ p: '$3' }}>
          <Heading size="3">
            {room.name} - {room.id}
          </Heading>
          <Caption size="2">Enter your name</Caption>
          <TextField ref={nameRef} placeholder="inspectorT" />
          <Text>Selected Game {room.state.selectedGame}</Text>
          <Button size="3" onClick={handleSubmitName}>
            Submit name
          </Button>
          <Button size="3" onClick={handleChooseDiffusionary}>
            Choose Diffusionary
          </Button>
          <Button size="3" onClick={handleChooseTriviaJam}>
            Choose Trivia Jam
          </Button>
        </Flex>
      ) : (
        <Skeleton />
      )}
    </Flex>
  );
};
