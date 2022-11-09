import { useCallback, useRef } from 'react';
import { Button } from '../../components/atoms/Button';
import { Fieldset } from '../../components/atoms/Fieldset';
import { Label } from '../../components/atoms/Label';
import { Text } from '../../components/atoms/Text';
import { TextField } from '../../components/atoms/TextField';
import { useClubScreenActor, useHostPlayerName } from './club-screen.hooks';
import { ClubScreenEvents } from './club-screen.machine';
import { Container } from './club.styles';

export const EnterPhoneNumber = () => {
  const actor = useClubScreenActor();
  const hostPlayerName = useHostPlayerName();
  const phoneNumberRef = useRef<HTMLInputElement>(null);

  const handleChangePhoneNumber = useCallback(() => {
    actor.send(
      ClubScreenEvents.INPUT_CHANGE_PHONE_NUMBER(
        phoneNumberRef.current?.value || ''
      )
    );
  }, [actor]);

  return (
    <Container>
      <form>
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
        <Button type="submit" fullWidth size="2" color="green">
          Submit
        </Button>
      </form>
    </Container>
  );
};
