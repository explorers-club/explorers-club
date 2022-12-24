import React, { FC, useCallback, useRef } from 'react';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { Heading } from '@atoms/Heading';
import { TextField } from '@atoms/TextField';
import { Button } from '@atoms/Button';
import { Box } from '@atoms/Box';
import { Card } from '@atoms/Card';

interface Props {
  onSubmitClubName: (name: string) => void;
}

export const NewRoomComponent: FC<Props> = ({ onSubmitClubName }) => {
  const clubNameRef = useRef<HTMLInputElement>(null);
  const handleSubmit = useCallback(() => {
    if (clubNameRef.current?.value) {
      onSubmitClubName(clubNameRef.current.value);
    }
  }, [clubNameRef, onSubmitClubName]);

  return (
    <Box css={{ p: '$3' }}>
      <Card>
        <Flex direction="column" css={{ p: '$3' }} gap="3">
          <Heading>Start a new explorers club room</Heading>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="2">
              <Text>Enter your club name (e.g. explorers.club/inspectorT)</Text>
              <TextField
                css={{ textAlign: 'center' }}
                ref={clubNameRef}
                placeholder={'(e.g. inspectorT)'}
                name="clubName"
              />
              <Button size="3" color="primary" type="submit">
                Create
              </Button>
            </Flex>
          </form>
        </Flex>
      </Card>
    </Box>
  );
};
