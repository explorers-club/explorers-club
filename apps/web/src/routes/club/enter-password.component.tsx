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
import {
  EnterPasswordActor,
  EnterPasswordFormEvents,
} from './enter-password.machine';

interface Props {
  formActor: EnterPasswordActor;
}

export const EnterPassword: FC<Props> = ({ formActor }) => {
  useActorLogger(formActor);
  const hostPlayerName = useHostPlayerName();
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
    <Container>
      <form onSubmit={handleSubmit}>
        <Text>Choose a password</Text>
        <Fieldset>
          <Label>Password</Label>
          <TextField
            ref={passwordRef}
            type="password"
            id="password"
            onChange={handleChangePassword}
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
