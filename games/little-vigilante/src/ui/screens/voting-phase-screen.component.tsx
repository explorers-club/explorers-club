import { Box } from '@atoms/Box';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { FC } from 'react';
import { Caption } from '@atoms/Caption';
import { RadioCard, RadioCardGroup } from '@molecules/RadioCard';

interface Props {
  timeRemaining: number;
  playerVoteCounts: { name: string; userId: string; count: number }[];
  onSubmitVote: (votedUserId: string) => void;
}

export const VotingPhaseScreenComponent: FC<Props> = ({
  timeRemaining,
  playerVoteCounts,
  onSubmitVote,
}) => {
  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="2">
          <Caption>{timeRemaining} seconds left</Caption>
          <Heading>Who is the Vigilante?</Heading>
          <RadioCardGroup onValueChange={onSubmitVote}>
            <Flex direction="column" gap="3">
              {playerVoteCounts.map(({ userId, name, count }) => (
                <RadioCard key={userId} value={userId}>
                  <Flex key={userId} css={{ width: '100%' }} justify="between">
                    <Heading>{name}</Heading>
                    <Heading>{count}</Heading>
                  </Flex>
                </RadioCard>
              ))}
            </Flex>
          </RadioCardGroup>
        </Flex>
      </Card>
    </Box>
  );
};
