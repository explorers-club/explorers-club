import { FC, FormEventHandler, useCallback, useRef } from 'react';
import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Subheading } from '@atoms/Subheading';
import { Text } from '@atoms/Text';
import { Fieldset } from '@atoms/Fieldset';
import { TextField } from '@atoms/TextField';
import { useHostPlayerName } from './club-screen.hooks';
import { EnterEmailActor, EnterEmailFormEvents } from './enter-email.machine';

interface Props {
  formActor: EnterEmailActor;
}

export const EnterEmail: FC<Props> = ({ formActor }) => {
  const hostPlayerName = useHostPlayerName();
  const emailRef = useRef<HTMLInputElement>(null);

  // const canSubmit = useSelector(
  //   formActor,
  //   (state) => !state.matches('Editing.Error')
  // );

  const handleChangeEmail = useCallback(() => {
    formActor.send(
      EnterEmailFormEvents.CHANGE({
        email: emailRef.current?.value,
      })
    );
  }, [formActor]);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      formActor.send(EnterEmailFormEvents.SUBMIT());
      event.preventDefault();
    },
    [formActor]
  );

  return (
    <Box css={{ p: '$3' }}>
      <form onSubmit={handleSubmit}>
        <Flex css={{ fd: 'column', gap: '$2', alignItems: 'center' }}>
          <Heading size="2">What is your email?</Heading>
          <Subheading size="2">
            Set an email to claim explorers.club/
            <strong>{hostPlayerName}</strong>
          </Subheading>
          <TextField
            ref={emailRef}
            type="email"
            id="email"
            placeholder="e.g. teddy@explorers.club"
            onChange={handleChangeEmail}
          />
          <Button size="3" color="blue" fullWidth>
            Submit
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
