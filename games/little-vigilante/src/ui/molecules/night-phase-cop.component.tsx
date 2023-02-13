import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { colorBySlotNumber } from '@explorers-club/styles';
import { ListRadioCard, RadioCardGroup } from '@molecules/RadioCard';
import { FC, useCallback } from 'react';
import { PlayerAvatar } from './player-avatar.component';

interface Props {
  onSelectPlayer: (userId: string) => void;
  players: { userId: string; name: string; slotNumber: number }[];
}

export const NightPhaseCopComponent: FC<Props> = ({
  onSelectPlayer,
  players,
}) => {
  const handleChange = useCallback(
    (value: string) => {
      onSelectPlayer(value);
    },
    [onSelectPlayer]
  );

  return (
    <Flex direction="column" gap="3">
      <Caption>Cop</Caption>
      <Text>
        Choose a player to arrest. They will not be able to use their ability.
      </Text>
      <RadioCardGroup onValueChange={handleChange}>
        <Flex direction="column" gap="3">
          {players.map(({ userId, name, slotNumber }) => (
            <ListRadioCard
              key={userId}
              value={userId}
              css={{ p: '$2', width: '100%' }}
            >
              <Flex
                gap="2"
                justify="between"
                align="center"
                css={{ flex: '1' }}
              >
                <Text
                  variant={colorBySlotNumber[slotNumber]}
                  css={{ fontWeight: 'bold' }}
                  size="5"
                >
                  {name}
                </Text>
                <PlayerAvatar
                  userId={userId}
                  color={colorBySlotNumber[slotNumber]}
                />
              </Flex>
            </ListRadioCard>
          ))}
        </Flex>
      </RadioCardGroup>
    </Flex>
  );
};
