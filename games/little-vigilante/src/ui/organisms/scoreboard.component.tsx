import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Scoreboard as PlayerScoreboard } from '@molecules/Scoreboard';
import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { selectPlayers } from '../../state/little-vigilante.selectors';

export const Scoreboard = () => {
  const players = useLittleVigilanteSelector(selectPlayers);
  const currentRound = useLittleVigilanteSelector(
    (state) => state.currentRound
  );

  return (
    <Flex direction="column" css={{ p: '$3' }}>
      <Flex direction="column" gap="2">
        <Caption>Round {currentRound}</Caption>
      </Flex>
      <PlayerScoreboard players={players} />
    </Flex>
  );
};
