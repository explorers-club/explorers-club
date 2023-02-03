import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { RadioCard, RadioCardGroup } from '@molecules/RadioCard';
import { FC, useCallback, useState } from 'react';
import { displayNameByRole, Role } from '../../meta/little-vigilante.constants';

type Player = { userId: string; name: string; role: string };

interface Props {
  onSelectPlayer: (userId: string) => void;
  players: Player[];
}

export const NightPhaseDetectiveComponent: FC<Props> = ({
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
    <Flex direction="column" gap="3">
      <Caption>Detective</Caption>
      {!selectedPlayer ? (
        <>
          <Text>Choose a player to investigate to find out their role.</Text>
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
          <strong>{displayNameByRole[selectedPlayer.role as Role]}</strong>.
        </Text>
      )}
    </Flex>
  );
};
