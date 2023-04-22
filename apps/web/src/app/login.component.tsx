import { Button } from '@atoms/Button';
import { trpc } from '@explorers-club/api-client';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Label } from '@atoms/Label';
import { Text } from '@atoms/Text';
import { TextField } from '@atoms/TextField';
import { styled } from '@explorers-club/styles';
import * as Dialog from '@radix-ui/react-dialog';
import { FormEventHandler, useCallback, useRef, useState } from 'react';
import { useAppSend, useServiceSelector } from '../services';
import { AppState } from '../state/app.machine';
import { LoginInputSchema } from '@explorers-club/schema';
import * as z from 'zod';
import { getErrorMessageForField } from '@explorers-club/utils';

export const Login = () => {
  const send = useAppSend();
  const isOpen = useServiceSelector('appService', selectLoginIsOpen);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        send({ type: 'CLOSE_LOGIN' });
      }
    },
    [send]
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <LoginDrawerOverlay />
        <LoginDrawerContent />
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const StyledDialogContent = styled(Dialog.Content, {
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100%',
  backgroundColor: '$primary3',
  '@bp2': {
    maxWidth: '50%',
  },
  '@bp3': {
    maxWidth: '30%',
  },
  '@bp4': {
    maxWidth: '20%',
  },
});

const LoginDrawerContent = () => {
  const { client } = trpc.useContext();
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState<
    z.ZodError<z.infer<typeof LoginInputSchema>> | undefined
  >(undefined);
  const appSend = useAppSend();

  const handleSubmitLogin: FormEventHandler = useCallback(
    (e) => {
      if (disabled) {
        return;
      }
      e.preventDefault();
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;

      const result = LoginInputSchema.safeParse({
        email,
        password,
      });
      if (result.success) {
        setDisabled(true);
        setError(undefined);
        client.auth.login.mutate(result.data).then(() => {
          setDisabled(false);
          // todo where to go now?
        });
      } else {
        setError(result.error);
        console.log(result.error);
      }
    },
    [disabled, setDisabled, client]
  );
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailError = getErrorMessageForField(error, 'email');
  const passwordError = getErrorMessageForField(error, 'password');

  return (
    <StyledDialogContent>
      <Flex direction="column">
        <Heading>Login</Heading>
        <Text>Welcome back to Explorers Club</Text>
        <form onSubmit={handleSubmitLogin}>
          {error && (
            <Text>
              There was a valdiation error, please fix and submit again
            </Text>
          )}
          <Label htmlFor="name">Name</Label>
          <TextField name="email" type="text" ref={emailRef} />
          {emailError && <Text>{emailError}</Text>}
          <Label htmlFor="name">Password</Label>
          <TextField name="password" type="password" ref={passwordRef} />
          {passwordError && <Text>{passwordError}</Text>}
          <Button disabled={disabled} size="3" fullWidth>
            Submit
          </Button>
        </form>
      </Flex>
    </StyledDialogContent>
  );
};

const LoginDrawerOverlay = styled(Dialog.Overlay, {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,.7)',
});

const selectLoginIsOpen = (state: AppState) => state.matches('Login.Open');
