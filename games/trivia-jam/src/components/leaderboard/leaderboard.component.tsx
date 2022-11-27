import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { FC } from 'react';

interface Props {
  scoresByPlayerName: Record<string, number>;
}

export const Leaderboard: FC<Props> = ({ scoresByPlayerName }) => {
  return (
    <Box css={{ p: '$3' }}>
      <Flex justify="between">
        <Caption>Player</Caption>
        <Caption>Score</Caption>
      </Flex>
      <Flex direction="column">
        {Object.entries(scoresByPlayerName).map(([playerName, score]) => (
          <Flex key={playerName} justify="between">
            <Heading size="4">{playerName}</Heading>
            <Heading size="4">{score}</Heading>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};
