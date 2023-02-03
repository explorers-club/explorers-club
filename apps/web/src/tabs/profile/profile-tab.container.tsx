import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';

export const ProfileTab = () => {
  return (
    <Flex gap="3" direction="column" css={{ background: '$primary3', p: '$3' }}>
      <RegistrationCard />
      <ReservedCard />
    </Flex>
  );
  // const { profileTabActor } = useContext(AppContext);
  // const db = useContext(DatabaseContext);
  // const session = useQuery('session', db.auth.getSession);
  // console.log(session);
  // return <ProfileTabComponent actor={profileTabActor} />;
};

const RegistrationCard = () => {
  return (
    <Card css={{ p: '$3', aspectRatio: 1 }}>
      <Heading>Registration</Heading>
    </Card>
  );
};

const ReservedCard = () => {
  return (
    <Card css={{ p: '$3', aspectRatio: 1 }}>
      <Heading>Explorers Club Reserved</Heading>
    </Card>
  );
};
