import { Box } from '@atoms/Box';
import { Card } from '@atoms/Card';
import { Text } from '@atoms/Text';
import { FC } from 'react';
interface Props {
  role: string;
}

export const NightPhaseScreenComponent: FC<Props> = ({ role }) => {
  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>{getComponent(role)}</Card>
    </Box>
  );
};

const getComponent = (role: string) => {
  switch (role) {
    case 'vigilante':
      return <Vigilante />;
    case 'sidekick':
      return <Sidekick />;
    case 'jester':
      return <Jester />;
    case 'cop':
      return <Cop />;
    case 'detective':
      return <Detective />;
    case 'butler':
      return <Butler />;
    case 'mayor':
      return <Mayor />;
    default:
      return null;
  }
};

const Vigilante = () => {
  return <Text>Vigilante, look at one other players role</Text>;
};

const Sidekick = () => {
  return <Text>Sidekick, look at the vigilante</Text>;
};

const Jester = () => {
  return <Text>Jester, swap any two players cards</Text>;
};

const Cop = () => {
  return <Text>Cop, see other copy</Text>;
};

const Detective = () => {
  return <Text>Detective see other detective</Text>;
};

const Butler = () => {
  return <Text>Butler you know who the vigilante is</Text>;
};

const Mayor = () => {
  return <Text>Mayor get two votes</Text>;
};
