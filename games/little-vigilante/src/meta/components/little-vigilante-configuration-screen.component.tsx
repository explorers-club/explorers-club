import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Select } from '@atoms/Select';
import { Text } from '@atoms/Text';
import { TextField } from '@atoms/TextField';
import {
  LittleVigilanteConfig,
  LittleVigilanteConfigSchema,
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
  const discussionTimeSecondsRef = useRef<HTMLInputElement>(null);
  const votingTimeSecondsRef = useRef<HTMLInputElement>(null);
  const roundsToPlayRef = useRef<HTMLInputElement>(null);

  const handlePressSave = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const maxPlayers = parseInt(maxPlayersEntryRef.current!.value);
    const discussionTimeSeconds = parseInt(
      discussionTimeSecondsRef.current!.value
    );
    const votingTimeSeconds = parseInt(votingTimeSecondsRef.current!.value);
    const roundsToPlay = parseInt(roundsToPlayRef.current!.value);

    const config = LittleVigilanteConfigSchema.parse({
      gameId: 'little_vigilante' as const,
      maxPlayers,
      discussionTimeSeconds,
      votingTimeSeconds,
      roundsToPlay,
    });

    onSubmitConfig(config);
  }, [onSubmitConfig]);

  return (
    <Card css={{ p: '$3' }}>
      <Flex direction="column" gap="2">
        <Caption>Configure</Caption>
        <Heading size="3">Game Settings</Heading>
        <form>
          <Box>
            <Text size="2">Discussion Time</Text>
            <TextField
              ref={discussionTimeSecondsRef}
              defaultValue={initialConfig.discussionTimeSeconds}
              type="number"
            />
          </Box>
          <Box>
            <Text size="2">Voting Time</Text>
            <TextField
              ref={votingTimeSecondsRef}
              defaultValue={initialConfig.votingTimeSeconds}
              type="number"
            />
          </Box>
          <Box>
            <Text size="2">Number Of Rounds</Text>
            <TextField
              ref={roundsToPlayRef}
              defaultValue={initialConfig.roundsToPlay}
              type="number"
            />
          </Box>
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
        </form>
      </Flex>
    </Card>
  );
};
