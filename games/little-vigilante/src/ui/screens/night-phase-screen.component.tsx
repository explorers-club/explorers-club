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
      return <VigilanteScreen />;
    case 'sidekick':
      return <SidekickScreen />;
    case 'jester':
      return <JesterScreen />;
    case 'cop':
      return <CopScreen />;
    case 'detective':
      return <DetectiveScreen />;
    case 'butler':
      return <ButlerScreen />;
    case 'mayor':
      return <MayorScreen />;
    default:
      return null;
  }
};

const VigilanteScreen = () => {
  return <Text>Vigilante, look at one other players role</Text>;
};

const SidekickScreen = () => {
  return <Text>Sidekick, look at the vigilante</Text>;
};

const JesterScreen = () => {
  return <Text>Jester, swap any two players cards</Text>;
};

const CopScreen = () => {
  return <Text>Cop, see other copy</Text>;
};

const DetectiveScreen = () => {
  return <Text>Detective see other detective</Text>;
};

const ButlerScreen = () => {
  return <Text>Butler you know who the vigilante is</Text>;
};

const MayorScreen = () => {
  return <Text>Mayor get two votes</Text>;
};
