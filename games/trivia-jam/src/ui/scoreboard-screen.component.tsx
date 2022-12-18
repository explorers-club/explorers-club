import React, { FC } from 'react';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Caption } from '@atoms/Caption';
import { TriviaJamPlayer } from '@explorers-club/schema-types/TriviaJamPlayer';

interface Props {
  players: TriviaJamPlayer[];
}

export const ScoreboardScreenComponent: FC<Props> = ({ players }) => {
  return (
    <Flex direction="column" css={{ p: '$3' }}>
      <Caption>Scoreboard</Caption>
      <Flex direction="column">
        {players.map(({ userId, name, score }) => (
          <Flex justify="between" key={userId}>
            <Heading>{name}</Heading>
            <Heading>{score}</Heading>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
