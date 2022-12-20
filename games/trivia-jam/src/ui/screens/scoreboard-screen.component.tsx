import React, { FC } from 'react';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Caption } from '@atoms/Caption';
import { TriviaJamPlayer } from '@explorers-club/schema-types/TriviaJamPlayer';
import { Button } from '@atoms/Button';

interface Props {
  players: TriviaJamPlayer[];
  showNext: boolean;
  onPressNext?: () => void;
}

export const ScoreboardScreenComponent: FC<Props> = ({
  players,
  showNext,
  onPressNext,
}) => {
  return (
    <Flex direction="column" css={{ p: '$3' }}>
      <Caption>Scoreboard</Caption>
      <Flex direction="column" css={{ py: '$3' }}>
        {players.map(({ userId, name, score }) => (
          <Flex justify="between" key={userId}>
            <Heading size="3">{name}</Heading>
            <Heading size="3">{score}</Heading>
          </Flex>
        ))}
      </Flex>
      {showNext && (
        <Button size="3" color="primary" fullWidth onClick={onPressNext}>
          Next
        </Button>
      )}
    </Flex>
  );
};
