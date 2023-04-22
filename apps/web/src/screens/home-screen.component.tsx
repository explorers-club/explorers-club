import { Button } from '@atoms/Button';
import { Card } from '@atoms/Card';
import { Text } from '@atoms/Text';
import { Label } from '@atoms/Label';
import { TextField } from '@atoms/TextField';
import { useMachine } from '@xstate/react';
import { useSubscription } from 'observable-hooks';
import { FormEventHandler, useCallback, useRef, useState } from 'react';
import { from } from 'rxjs';
import { useAppSend } from '../services';
import { useHomeMachine } from './home-screen.hooks';

export const HomeScreen = () => {
  const homeMachine = useHomeMachine();
  const appSend = useAppSend();
  const [state, send, service] = useMachine(homeMachine);
  const [state$] = useState(from(service));

  useSubscription(state$, {
    complete() {
      const { name } = service.getSnapshot().context;
      if (!name) {
        console.warn('Unexpected name but none found');
        return;
      }

      appSend({ type: 'JOIN_ROOM', name });
    },
    next() {
      // no-op, can't do just complete
    },
  });

  const handlePressNew = useCallback(() => {
    send({ type: 'START_NEW' });
  }, [send]);

  const nameRef = useRef<HTMLInputElement>(null);

  const handlePressLogin = useCallback(() => {
    appSend({ type: 'OPEN_LOGIN' });
  }, [appSend]);

  const handleSubmitName: FormEventHandler = useCallback(
    (event) => {
      event.preventDefault();

      const value = nameRef.current?.value;
      if (!value || value === '') {
        return;
      }

      send({ type: 'SUBMIT_NAME', name: nameRef.current?.value });
    },
    [nameRef, send]
  );

  return (
    <Card>
      {state.matches('Idle') && (
        <Button size="3" fullWidth onClick={handlePressNew}>
          Start New
        </Button>
      )}
      {state.matches('EnteringInfo') && (
        <>
          <Text>
            Already have an account?{' '}
            <Button onClick={handlePressLogin}>Login</Button>
          </Text>
          <form onSubmit={handleSubmitName}>
            <Label htmlFor="name">Name</Label>
            <TextField name="name" type="text" ref={nameRef} />
            <Button size="3" fullWidth>
              Submit
            </Button>
          </form>
        </>
      )}
    </Card>
  );
};
