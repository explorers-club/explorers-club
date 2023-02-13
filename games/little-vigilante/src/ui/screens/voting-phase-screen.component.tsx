import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Grid } from '@atoms/Grid';
import { Heading } from '@atoms/Heading';
import { IconButton } from '@atoms/IconButton';
import { Text } from '@atoms/Text';
import { colorBySlotNumber } from '@explorers-club/styles';
import { Popover, PopoverContent } from '@molecules/Popover';
import { ListRadioCard, RadioCardGroup } from '@molecules/RadioCard';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { FC } from 'react';
import { PlayerAvatar } from '../molecules/player-avatar.component';

interface Props {
  timeRemaining: number;
  playerVoteCounts: {
    name: string;
    userId: string;
    count: number;
    slotNumber: number;
  }[];
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
          <Flex justify="between">
            <Flex direction="column" gap="1">
              <Caption>{timeRemaining} seconds left</Caption>
              <Heading size="2">Vote</Heading>
            </Flex>
            <Popover>
              <PopoverTrigger asChild>
                <IconButton size="3">
                  <InfoCircledIcon />
                </IconButton>
              </PopoverTrigger>
              <PopoverContent>
                <Card css={{ p: '$3' }}>
                  <Heading size="2" css={{ mb: '$2' }}>
                    Who Should I Vote For?
                  </Heading>
                  <Flex direction="column" gap="2">
                    <Text css={{ fontWeight: 'bold' }}>
                      If you are one of the citizens
                    </Text>
                    <Text>Vote for the vigilante or sidekick</Text>
                    <Text css={{ fontWeight: 'bold' }}>
                      If you are one of the vigilantes
                    </Text>
                    <Text>Vote for anybody but your selves</Text>
                    <Text css={{ fontWeight: 'bold' }}>
                      If you are the anarchist
                    </Text>
                    <Text>Vote for your self</Text>
                    <Caption>
                      Remember: your role could have changed in the night phase
                      without you seeing. You may not be who you think you are.
                    </Caption>
                  </Flex>
                </Card>
              </PopoverContent>
            </Popover>
          </Flex>
          <RadioCardGroup onValueChange={onSubmitVote}>
            <Flex direction="column" gap="3">
              {playerVoteCounts.map(({ userId, name, count, slotNumber }) => (
                <ListRadioCard key={userId} value={userId}>
                  <Flex key={userId} css={{ width: '100%' }} align="center" justify="between">
                    <Flex gap="2" align="center">
                      <PlayerAvatar
                        color={colorBySlotNumber[slotNumber]}
                        userId={userId}
                      />
                      <Heading variant={colorBySlotNumber[slotNumber]}>
                        {name}
                      </Heading>
                    </Flex>
                    <Heading>{count}</Heading>
                  </Flex>
                </ListRadioCard>
              ))}
            </Flex>
          </RadioCardGroup>
        </Flex>
      </Card>
    </Box>
  );
};
