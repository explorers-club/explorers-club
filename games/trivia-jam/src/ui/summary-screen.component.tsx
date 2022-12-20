import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { TriviaJamPlayer } from '@explorers-club/schema-types/TriviaJamPlayer';
import { FC } from 'react';

interface Props {
  players: TriviaJamPlayer[];
}

export const SummaryScreenComponent: FC<Props> = ({ players }) => {
  return (
    <Flex direction="column" css={{ p: '$3' }}>
      <Caption>Game Over</Caption>
      <Heading>Thank you for playing!</Heading>
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
  );
};
