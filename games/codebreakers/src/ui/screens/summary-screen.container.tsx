import { Box } from '@atoms/Box';
import { Card } from '@atoms/Card';
import { Heading } from '@atoms/Heading';
import { useCodebreakersSelector } from '../../state/codebreakers.hooks';
import { selectWinningTeam } from '../../state/codebreakers.selectors';

export const SummaryScreen = () => {
  const winningTeam = useCodebreakersSelector(selectWinningTeam);
  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Heading>Team {winningTeam} Wins!</Heading>
      </Card>
    </Box>
  );
};
