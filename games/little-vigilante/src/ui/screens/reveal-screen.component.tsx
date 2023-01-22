import { Badge } from '@atoms/Badge';
import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Grid } from '@atoms/Grid';
import { Heading } from '@atoms/Heading';
import { Image } from '@atoms/Image';
import { Text } from '@atoms/Text';
import { FC } from 'react';
import { imageByRole, Role } from '../../meta/little-vigilante.constants';

interface Props {
  playerOutcomes: { playerName: string; role: Role; winner: boolean }[];
  onPressNext?: () => void;
}

export const RevealScreenComponent: FC<Props> = ({
  playerOutcomes,
  onPressNext,
}) => {
  return (
    <Box css={{ p: '$3' }}>
      <Card>
        <Flex direction="column" css={{ p: '$3' }} gap="3">
          <Caption>The Reveal</Caption>
          <Grid gap="2" css={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {playerOutcomes.map(({ playerName, role, winner }) => (
              <Card>
                <Image src={imageByRole[role]} alt={role} />
                <Box
                  css={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    p: '$2',
                    pt: '$8',
                    background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))',
                  }}
                >
                  <Heading>{playerName}</Heading>
                  <Caption>{role}</Caption>
                  {winner && (
                    <Badge
                      css={{ position: 'absolute', top: '0', right: '$1' }}
                      variant="green"
                    >
                      Winner
                    </Badge>
                  )}
                </Box>
              </Card>
              // <Flex key={playerName} justify="between">
              //   <Heading size="2">{playerName}</Heading>
              //   <Heading size="2">{role}</Heading>
              // </Flex>
            ))}
          </Grid>
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
