import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { FC } from 'react';
import { TriviaJamPlayerSerialized } from '../../types';

interface Props {
  players: TriviaJamPlayerSerialized[];
  showNext: boolean;
  onPressNext?: () => void;
}

export const ScoreboardScreenComponent: FC<Props> = ({
  players,
  showNext,
  onPressNext,
}) => {
  return (
    <Box css={{ p: '$3' }}>
      <Card>
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
      </Card>
    </Box>
  );
};
