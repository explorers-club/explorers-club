import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';

export const HomeTab = () => {
  return (
    <Flex gap="3" direction="column" css={{ background: '$primary3', p: '$3' }}>
      <WelcomeCard />
      <LobbyCard />
      <GameCarouselCard />
      <GameScoreboardCard />
    </Flex>
  );
};

const WelcomeCard = () => {
  return (
    <Card css={{ p: '$3', aspectRatio: 1 }}>
      <Heading>Welcome To Explorers Club</Heading>
    </Card>
  );
};

const LobbyCard = () => {
  return (
    <Card css={{ p: '$3', aspectRatio: 1 }}>
      <Heading>Lobby</Heading>
    </Card>
  );
};

const GameCarouselCard = () => {
  return (
    <Card css={{ p: '$3', aspectRatio: 4 / 3 }}>
      <Heading>Games</Heading>
    </Card>
  );
};

const GameScoreboardCard = () => {
  return (
    <Card css={{ p: '$3', aspectRatio: 4 / 3 }}>
      <Heading>Scoreboard</Heading>
    </Card>
  );
};
