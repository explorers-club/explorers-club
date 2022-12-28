import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { FC } from 'react';
import { TriviaJamPlayerSerialized } from '@explorers-club/room';

interface Props {
  players: TriviaJamPlayerSerialized[];
}

export const SummaryScreenComponent: FC<Props> = ({ players }) => {
  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="2">
          <Caption>Thank you for playing!</Caption>
          <Heading>Final Scores</Heading>
          <Flex direction="column" css={{ py: '$3' }}>
            {players.map(({ userId, name, score }) => (
              <Flex justify="between" key={userId}>
                <Heading size="3">{name}</Heading>
                <Heading size="3">{score}</Heading>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
};
