import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { RadioCard, RadioCardGroup } from '@molecules/RadioCard';
import { FC, useCallback } from 'react';

interface Props {
  onSelectPlayer: (userId: string) => void;
  players: { userId: string; name: string }[];
}

export const NightPhasePoliticianScreenComponent: FC<Props> = ({
  onSelectPlayer,
  players,
}) => {
  const handleChange = useCallback(
    (userId: string) => {
      onSelectPlayer(userId);
    },
    [onSelectPlayer]
  );

  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="3">
          <Caption>Politician</Caption>
          <Text>Choose a player to swap your role with</Text>
          <RadioCardGroup onValueChange={handleChange}>
            <Flex direction="column" gap="3">
              {players.map(({ userId, name }) => (
                <RadioCard
                  key={userId}
                  value={userId}
                  css={{ p: '$2', width: '100%' }}
                >
                  <Text size="5">{name}</Text>
                </RadioCard>
              ))}
            </Flex>
          </RadioCardGroup>
        </Flex>
      </Card>
    </Box>
  );
};