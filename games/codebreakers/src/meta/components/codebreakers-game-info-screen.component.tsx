import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';

export const CodebreakersGameInfoScreen = () => {
  return (
    <Flex css={{ p: '$3' }} gap="2" direction="column">
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="2">
          <Caption>Codebreakers</Caption>
          <Heading size="3">How to Play</Heading>
          <Text>Codebreakers is a word clue game.</Text>
          <Text>Here are the basic rules of the game:</Text>
        </Flex>
      </Card>
    </Flex>
  );
};
