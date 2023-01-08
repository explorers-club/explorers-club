import { Button } from '@atoms/Button';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { TextField } from '@atoms/TextField';
import { FC, FormEventHandler, useCallback, useRef } from 'react';

interface Props {
  onSubmit: (name: string) => void;
}

export const NameForm: FC<Props> = ({ onSubmit }) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const handleSubmitName: FormEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      if (nameRef.current && nameRef.current.value !== '') {
        onSubmit(nameRef.current.value);
      }
    },
    [nameRef, onSubmit]
  );

  return (
    <Flex direction="column" css={{ p: '$3' }}>
      <Card>
        <form onSubmit={handleSubmitName}>
          <Flex direction="column" gap="3" css={{ p: '$3' }}>
            <Heading>Choose a name</Heading>
            <TextField ref={nameRef} placeholder="Name" />
            <Button size="3" color="primary" type="submit">
              Enter
            </Button>
          </Flex>
        </form>
      </Card>
    </Flex>
  );
};
