import { useSelector } from '@xstate/react';
import { FormEventHandler, useCallback, useRef } from 'react';
import { Button } from '../../components/atoms/Button';
import { Fieldset } from '../../components/atoms/Fieldset';
import { Label } from '../../components/atoms/Label';
import { Text } from '../../components/atoms/Text';
import { TextField } from '../../components/atoms/TextField';
import { useActorLogger } from '../../lib/logging';
import { useClubScreenActor, useHostPlayerName } from './club-screen.hooks';
import { ClubScreenEvents } from './club-screen.machine';
import { Container } from './club.styles';

export const EnterPhoneNumber = () => {
  const actor = useClubScreenActor();
  useActorLogger(actor);
  const hostPlayerName = useHostPlayerName();
  const phoneNumberRef = useRef<HTMLInputElement>(null);

  const canSubmit = useSelector(actor, (state) =>
    state.matches('Unclaimed.Claiming.EnterPhoneNumber.Valid.Yes')
  );

  const handleChangePhoneNumber = useCallback(() => {
    actor.send(
      ClubScreenEvents.INPUT_CHANGE_PHONE_NUMBER(
        phoneNumberRef.current?.value || ''
      )
    );
  }, [actor]);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      actor.send(ClubScreenEvents.PRESS_SUBMIT());
      event.preventDefault();
    },
    [actor]
  );

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Text>
          Enter your phone number to claim explorers.club/{hostPlayerName}
        </Text>
        <Fieldset>
          <Label>Phone Number</Label>
          <TextField
            ref={phoneNumberRef}
            type="tel"
            id="phoneNumber"
            placeholder="3108675309"
            pattern="^[0-9_-]*$"
            onChange={handleChangePhoneNumber}
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
