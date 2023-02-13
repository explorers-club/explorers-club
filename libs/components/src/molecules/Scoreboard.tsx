import { FC } from 'react';
import { Flex } from '../atoms/Flex';
import { Heading } from '../atoms/Heading';

interface Player {
  name: string;
  score: number;
}

interface Props {
  players: Player[];
}

export const Scoreboard: FC<Props> = ({ players }) => {
  return (
    <Flex direction="column" css={{ py: '$3' }}>
      {players
        .sort((a, b) => b.score - a.score)
        .map(({ name, score }) => (
          <Flex justify="between" key={name}>
            <Heading>{name}</Heading>
            <Heading>{score}</Heading>
          </Flex>
        ))}
    </Flex>
  );
};
