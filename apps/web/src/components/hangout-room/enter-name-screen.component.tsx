import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { TextField } from '@atoms/TextField';
import { useSelector } from '@xstate/react';
import { useCallback, useContext, useRef } from 'react';
import { HangoutRoomContext } from './hangout-room.context';

export const EnterNameScreen = () => {
  const service = useContext(HangoutRoomContext);
  const nameRef = useRef<HTMLInputElement>(null);

  const room = useSelector(service, (state) => state.context.room);

  const handleSubmitName = useCallback(() => {
    const playerName = nameRef.current?.value;
    if (playerName) {
      service.send({ type: 'ENTER_NAME', playerName });
    }
    // room.send('SET_NAME', nameRef.current?.value);
  }, [service]);

  return (
    <Flex direction="column">
      <Flex direction="column" gap="3" css={{ p: '$3' }}>
        <Heading size="3">{room.name}</Heading>
        <Caption size="2">Enter your name</Caption>
        <TextField ref={nameRef} placeholder="inspectorT" />
        <Button size="3" onClick={handleSubmitName}>
          Submit name
        </Button>
      </Flex>
    </Flex>
  );
};
