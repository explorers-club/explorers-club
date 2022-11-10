import { useSelector } from '@xstate/react';
import { FC, FormEventHandler, useCallback, useRef } from 'react';
import { Button } from '../../components/atoms/Button';
import { Fieldset } from '../../components/atoms/Fieldset';
import { Label } from '../../components/atoms/Label';
import { Text } from '../../components/atoms/Text';
import { TextField } from '../../components/atoms/TextField';
import { useActorLogger } from '../../lib/logging';
import { useHostPlayerName } from './club-screen.hooks';
import { Container } from './club.styles';
import { EnterEmailActor, EnterEmailFormEvents } from './enter-email.machine';

interface Props {
  formActor: EnterEmailActor;
}

export const EnterEmail: FC<Props> = ({ formActor }) => {
  useActorLogger(formActor);
  const hostPlayerName = useHostPlayerName();
  const emailRef = useRef<HTMLInputElement>(null);

  const canSubmit = useSelector(
    formActor,
    (state) => !state.matches('Editing.Error')
  );

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
    <Container>
      <form onSubmit={handleSubmit}>
        <Text>Enter your email to claim explorers.club/{hostPlayerName}</Text>
        <Fieldset>
          <Label>Email</Label>
          <TextField
            ref={emailRef}
            type="text"
            id="email"
            placeholder="e.g. teddy@explorers.club"
            onChange={handleChangeEmail}
          />
        </Fieldset>
        <Button
          disabled={!canSubmit}
          type="submit"
          fullWidth
          size="2"
          color="green"
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};
