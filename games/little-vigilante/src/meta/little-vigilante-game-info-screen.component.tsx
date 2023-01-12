import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { Heading } from '@atoms/Heading';

export const LittleVigilanteGameInfoScreen = () => {
  return (
    <Flex css={{ p: '$3' }} gap="2" direction="column">
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="2">
          <Caption>Little Vigilante</Caption>
          <Heading>How to Play</Heading>
          <Text>
            Little Vigilante is a social deduction game for 4-10 players. Each
            player takes on the role of a different character with unique
            abilities. The goal of the game is for the citizens to correctly
            identify who is the Little Vigilante.
          </Text>
          <Text>Here are the basic rules of the game:</Text>
          <Text>
            1. Each player is dealt a role card at the start of the round.
          </Text>
          <Text>
            2. The game is divided into two phases: night and morning. During
            the night phase, players perform their night actions as dictated by
            their role. In the morning phase, players discuss the events of the
            previous night then vote on who they believe is the Vigilante.
          </Text>
        </Flex>
      </Card>
      <Card css={{ p: '$3' }}>
        <Heading>Roles</Heading>
      </Card>
    </Flex>
  );
};
