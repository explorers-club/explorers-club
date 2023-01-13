import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { RadioCard, RadioCardGroup } from '@molecules/RadioCard';
import { FC, useCallback, useState } from 'react';

type Player = { userId: string; name: string; role: string };

interface Props {
  onSelectPlayer: (userId: string) => void;
  players: Player[];
}

export const NightPhaseDetectiveScreenComponent: FC<Props> = ({
  onSelectPlayer,
  players,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>();
  const handleChange = useCallback(
    (userId: string) => {
      onSelectPlayer(userId);
      const player = players.find((player) => player.userId === userId);
      setSelectedPlayer(player);
    },
    [onSelectPlayer, setSelectedPlayer, players]
  );

  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="3">
          <Caption>Cop</Caption>
          {!selectedPlayer ? (
            <>
              <Text>
                Choose a player to investigate to find out their role.
              </Text>
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
            </>
          ) : (
            <Text>
              <strong>{selectedPlayer.name}</strong> is the{' '}
              <strong>{selectedPlayer.role}</strong>.
            </Text>
          )}
        </Flex>
      </Card>
    </Box>
  );
};
