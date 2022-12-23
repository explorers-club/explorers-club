import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { TextField } from '@atoms/TextField';
import { useCallback, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ClubRoomContext } from './club-room.context';

export const EnterNameScreen = () => {
  const clubName = useParams()['clubName'];
  const service = useContext(ClubRoomContext);
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmitName = useCallback(() => {
    const playerName = nameRef.current?.value;
    if (playerName) {
      service.send({ type: 'ENTER_NAME', playerName });
    }
  }, [service]);

  return (
    <Flex direction="column" css={{ p: '$3' }}>
      <Card>
        <Flex direction="column" gap="3" css={{ p: '$3' }}>
          <Caption size="2">{clubName}'s Explorers Club</Caption>
          <Heading>Choose a name</Heading>
          <TextField ref={nameRef} placeholder="Name" />
          <Button size="3" color="primary" onClick={handleSubmitName}>
            Enter
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};
