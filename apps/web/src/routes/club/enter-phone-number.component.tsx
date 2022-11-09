import { Label } from '../../components/atoms/Label';
import { useHostPlayerName } from './club-screen.hooks';
import { Container } from './club.styles';

export const EnterPhoneNumber = () => {
  const hostPlayerName = useHostPlayerName();

  return (
    <Container>
      <Label>Enter your phone number to claim /{hostPlayerName}</Label>
    </Container>
  );
};
