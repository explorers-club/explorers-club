import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { FC } from 'react';

interface Props {
  playerRoles: (readonly [string, string])[];
  onPressNext?: () => void;
}

export const RevealScreenComponent: FC<Props> = ({
  playerRoles,
  onPressNext,
}) => {
  return (
    <Box css={{ p: '$3' }}>
      <Card>
        <Flex direction="column" css={{ p: '$3' }} gap="3">
          <Caption>Who's who</Caption>
          {playerRoles.map(([playerName, role]) => (
            <Flex key={playerName} justify="between">
              <Heading size="3">{playerName}</Heading>
              <Heading size="3">{role}</Heading>
            </Flex>
          ))}
          {onPressNext && (
            <Button size="3" color="primary" fullWidth onClick={onPressNext}>
              Continue
            </Button>
          )}
        </Flex>
      </Card>
    </Box>
  );
};
