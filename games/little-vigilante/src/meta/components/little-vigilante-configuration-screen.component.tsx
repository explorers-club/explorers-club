import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Select } from '@atoms/Select';
import { Text } from '@atoms/Text';
import {
  LittleVigilanteConfig,
  LittleVigilanteConfigSchema
} from '@explorers-club/schema';
import { FC, useCallback, useRef } from 'react';

const MAX_PLAYERS = 10;

interface Props {
  initialConfig: LittleVigilanteConfig;
  onSubmitConfig: (config: LittleVigilanteConfig) => void;
}

export const LittleVigilanteConfigurationScreenComponent: FC<Props> = ({
  initialConfig,
  onSubmitConfig,
}) => {
  const maxPlayersEntryRef = useRef<HTMLSelectElement>(null);

  const handlePressSave = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const maxPlayers = parseInt(maxPlayersEntryRef.current!.value);

    const config = LittleVigilanteConfigSchema.parse({
      gameId: 'little_vigilante' as const,
      maxPlayers,
    });

    onSubmitConfig(config);
  }, [onSubmitConfig]);

  return (
    <Card css={{ p: '$3' }}>
      <Flex direction="column" gap="2">
        <Caption>Configure</Caption>
        <Heading size="3">Game Settings</Heading>
        <Box>
          <Text size="2">Max Players</Text>
          <Select
            ref={maxPlayersEntryRef}
            defaultValue={initialConfig.maxPlayers}
          >
            {Array(7)
              .fill(0)
              .map((_, index) => {
                const value = MAX_PLAYERS - index;
                return (
                  <option key={index} value={value}>
                    {value}
                  </option>
                );
              })}
          </Select>
        </Box>
        <Button size="3" color="primary" onClick={handlePressSave}>
          Save
        </Button>
      </Flex>
    </Card>
  );
};
