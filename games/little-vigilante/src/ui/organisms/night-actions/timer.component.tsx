import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import {
  useMyUserId,
  useLittleVigilanteSelector,
} from '../../../state/little-vigilante.hooks';

export const Timer = () => {
  const myUserId = useMyUserId();
  const down = useLittleVigilanteSelector(
    (state) => state.currentDownState[myUserId]
  );

  const secondsLeft = useLittleVigilanteSelector((state) =>
    Math.max(
      Math.floor(
        (state.lastDownState[myUserId] + 60 * 10 - state.currentTick) / 60
      ),
      0
    )
  );

  if (down || secondsLeft > 5) {
    return null;
  }

  return (
    <Flex direction="column" align="center" css={{ flex: 1, p: '$2' }} gap="1">
      <Text size="6" css={{ fontWeight: 'bold' }}>
        {secondsLeft}
      </Text>
      <Caption>Idle Timer</Caption>
    </Flex>
  );
};
