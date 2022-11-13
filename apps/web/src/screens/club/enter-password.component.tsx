import { useSelector } from '@xstate/react';
import { FC, FormEventHandler, useCallback, useRef } from 'react';
import { Box } from '@explorers-club/components/atoms/Box';
import { Flex } from '@explorers-club/components/atoms/Flex';
import { Heading } from '@explorers-club/components/atoms/Heading';
import { Subheading } from '@explorers-club/components/atoms/Subheading';
import { Button } from '@explorers-club/components/atoms/Button';
import { TextField } from '@explorers-club/components/atoms/TextField';
import {
  EnterPasswordActor,
  EnterPasswordFormEvents,
} from './enter-password.machine';

interface Props {
  formActor: EnterPasswordActor;
}

export const EnterPassword: FC<Props> = ({ formActor }) => {
  const passwordRef = useRef<HTMLInputElement>(null);

  const canSubmit = useSelector(
    formActor,
    (state) => !state.matches('Editing.Error')
  );

  const handleChangePassword = useCallback(() => {
    formActor.send(
      EnterPasswordFormEvents.CHANGE({
        password: passwordRef.current?.value,
      })
    );
  }, [formActor]);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      formActor.send(EnterPasswordFormEvents.SUBMIT());
      event.preventDefault();
    },
    [formActor]
  );

  return (
    <Box css={{ p: '$3' }}>
      <form onSubmit={handleSubmit}>
        <Flex css={{ fd: 'column', gap: '$2', alignItems: 'center' }}>
          <Heading size="2">Enter a password</Heading>
          <Subheading size="2">
            Choose a{' '}
            <span role="img" aria-label="string">
              💪
            </span>{' '}
            one
          </Subheading>
          <TextField
            ref={passwordRef}
            type="password"
            id="password"
            onChange={handleChangePassword}
          />
          <Button size="3" color="blue" fullWidth disabled={!canSubmit}>
            Submit
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
