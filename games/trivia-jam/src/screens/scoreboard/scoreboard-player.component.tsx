import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { FC } from 'react';

interface Props {
  name: string;
  score: number;
}

export const ScoreboardPlayerComponent: FC<Props> = ({ name, score }) => {
  return (
    <Flex justify="between">
      <Heading size="4">{name}</Heading>
      <Heading size="4">{score}</Heading>
    </Flex>
  );
};
