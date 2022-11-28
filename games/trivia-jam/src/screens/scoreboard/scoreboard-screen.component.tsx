import { Box } from '@atoms/Box';
import { Flex } from '@atoms/Flex';
import { Caption } from '@atoms/Caption';
import { useSelector } from '@xstate/react';
import { FC } from 'react';
import { ScoreboardPlayer } from './scoreboard-player.container';
import { ScoreboardScreenActor } from './scoreboard-screen.machine';
import { selectScoresByUserId } from './scoreboard-screen.selectors';

interface Props {
  actor: ScoreboardScreenActor;
}

export const ScoreboardScreenComponent: FC<Props> = ({ actor }) => {
  const scoresByUserId = useSelector(actor, selectScoresByUserId);
  return (
    <Box css={{ p: '$4' }}>
      <Flex justify="between">
        <Caption>Player</Caption>
        <Caption>Points</Caption>
      </Flex>
      <Flex direction="column">
        {Object.entries(scoresByUserId).map(([userId, score]) => (
          <ScoreboardPlayer key={userId} userId={userId} score={score} />
        ))}
      </Flex>
    </Box>
  );
};
