import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { FC } from 'react';

interface Props {
  unusedRole: string;
}

export const NightPhaseVigilanteScreenComponent: FC<Props> = ({
  unusedRole,
}) => {
  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="3">
          <Caption>Vigilante</Caption>
          <Text>
            <strong>{unusedRole}</strong> is not being played by another player
          </Text>
        </Flex>
      </Card>
    </Box>
  );
};
