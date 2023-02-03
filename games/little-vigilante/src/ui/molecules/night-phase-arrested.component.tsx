import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';

export const NightPhaseArrested = () => {
  return (
    <Flex direction="column" gap="3">
      <Caption>Arrested</Caption>
      <Text>You've been arrested by the cop. Your ability is skipped.</Text>
    </Flex>
  );
};
