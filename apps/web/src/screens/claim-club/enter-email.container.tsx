import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Subheading } from '@atoms/Subheading';
import { TextField } from '@atoms/TextField';
import { useSelector } from '@xstate/react';
import { FC, FormEventHandler, useCallback, useContext, useRef } from 'react';
import { ClaimClubContext } from './claim-club.context';
import { EnterEmailActor, EnterEmailFormEvents } from './enter-email.machine';

interface Props {
  formActor: EnterEmailActor;
}

export const EnterEmail: FC<Props> = ({ formActor }) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const { actor: claimClubActor } = useContext(ClaimClubContext);

  const hostPlayerName = useSelector(
    claimClubActor,
    (state) => state.context.playerName
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
