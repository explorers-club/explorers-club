import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Heading } from '@atoms/Heading';
import { Flex } from '@atoms/Flex';
import { useSelector } from '@xstate/react';
import { useGameSharedService } from '../state/game.hooks';
import {
  selectPlayerUserIds,
  selectScores,
} from '../state/trivia-jam-shared.selectors';

export const Leaderboard = () => {
  const sharedService = useGameSharedService();
  const userIds = useSelector(sharedService, selectPlayerUserIds);
  const scores = useSelector(sharedService, selectScores);

  return (
    <Box css={{ p: '$3' }}>
      <Flex justify="between">
        <Caption>Player</Caption>
        <Caption>Score</Caption>
      </Flex>
      <Flex direction="column">
        {userIds.map((userId) => (
          <Flex key={userId} justify="between">
            <Heading size='4'>{userId}</Heading>
            <Heading size='4'>{scores[userId]}</Heading>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};
