import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Scoreboard } from '@molecules/Scoreboard';
import { FC } from 'react';
import { LittleVigilantePlayerSerialized } from '@explorers-club/room';
import { Heading } from '@atoms/Heading';

interface Props {
  players: LittleVigilantePlayerSerialized[];
  currentRound: number;
  onPressNext?: () => void;
}

export const ScoreboardScreenComponent: FC<Props> = ({
  players,
  currentRound,
  onPressNext,
}) => {
  return (
    <Box css={{ p: '$3' }}>
      <Card>
        <Flex direction="column" css={{ p: '$3' }}>
          <Caption>Scores</Caption>
          <Heading>Round {currentRound}</Heading>
          <Scoreboard players={players} />
          {onPressNext && (
            <Button size="3" color="primary" fullWidth onClick={onPressNext}>
              Next
            </Button>
          )}
        </Flex>
      </Card>
    </Box>
  );
};
