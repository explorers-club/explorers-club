import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Badge } from '@atoms/Badge';
import { Heading } from '@atoms/Heading';
import { colorBySlotNumber } from '@explorers-club/styles';
import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { selectPlayers } from '../../state/little-vigilante.selectors';
import { PlayerAvatar } from '../molecules/player-avatar.component';

export const Scoreboard = () => {
  const players = useLittleVigilanteSelector(selectPlayers);
  const hostIds = useLittleVigilanteSelector((state) => state.hostUserIds);
  const currentRound = useLittleVigilanteSelector(
    (state) => state.currentRound
  );

  return (
    <Flex direction="column" css={{ p: '$3' }}>
      <Flex direction="column" gap="2">
        <Caption>Round {currentRound}</Caption>
      </Flex>
      <Flex direction="column" css={{ py: '$3' }} gap="1">
        {players
          .sort((a, b) => b.score - a.score)
          .map(({ userId, name, score, slotNumber }) => (
            <Flex justify="between" key={name}>
              <Flex gap="1" align="center">
                <PlayerAvatar
                  size="1"
                  userId={userId}
                  color={colorBySlotNumber[slotNumber]}
                />

                <Heading variant={colorBySlotNumber[slotNumber]}>
                  {name}
                </Heading>
                {hostIds.includes(userId) && <Badge>host</Badge>}
              </Flex>
              <Heading>{score}</Heading>
            </Flex>
          ))}
      </Flex>
    </Flex>
  );
};
