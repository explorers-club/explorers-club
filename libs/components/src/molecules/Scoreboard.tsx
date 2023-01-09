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
      {players.map(({ name, score }) => (
        <Flex justify="between" key={name}>
          <Heading size="3">{name}</Heading>
          <Heading size="3">{score}</Heading>
        </Flex>
      ))}
    </Flex>
  );
};
