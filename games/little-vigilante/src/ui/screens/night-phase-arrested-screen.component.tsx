import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';

export const NightPhaseArrestedScreenComponent = () => {
  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="3">
          <Caption>Arrested</Caption>
          <Text>
            You've been arrested by the cop. Your ability is skipped.
          </Text>
        </Flex>
      </Card>
    </Box>
  );
};
