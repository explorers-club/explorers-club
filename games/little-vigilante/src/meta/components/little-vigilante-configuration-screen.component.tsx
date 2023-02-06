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
import { colorBySlotNumber } from '@explorers-club/styles';
import { CheckboxCard } from '@molecules/CheckboxCard';
import { FC, MouseEventHandler, useCallback, useRef } from 'react';
import { Role, ROLE_LIST } from '../little-vigilante.constants';

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
  const rolesToExcludeRef = useRef<Set<string>>(
    new Set(initialConfig.rolesToExclude)
  );

  const handleToggleRole = useCallback((role: Role) => {
    return (value: boolean) => {
      if (value) {
        rolesToExcludeRef.current.add(role);
      } else {
        rolesToExcludeRef.current.delete(role);
      }
    };
  }, []);

  const handlePressSave: MouseEventHandler = useCallback(
    (event) => {
      event.preventDefault();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const maxPlayers = parseInt(maxPlayersEntryRef.current!.value);
      const discussionTimeSeconds = parseInt(
        discussionTimeSecondsRef.current!.value
      );
      const votingTimeSeconds = parseInt(votingTimeSecondsRef.current!.value);
      const roundsToPlay = parseInt(roundsToPlayRef.current!.value);
      const rolesToExclude = Array.from(rolesToExcludeRef.current.values());

      const config = LittleVigilanteConfigSchema.parse({
        gameId: 'little_vigilante' as const,
        maxPlayers,
        discussionTimeSeconds,
        votingTimeSeconds,
        roundsToPlay,
        rolesToExclude,
      });
      console.log(config);

      onSubmitConfig(config);
    },
    [onSubmitConfig]
  );

  return (
    <Card css={{ p: '$3' }}>
      <Flex direction="column" gap="2">
        <Caption>Configure</Caption>
        <Heading size="3">Game Settings</Heading>
        <form>
          <Flex direction="column" gap="2">
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
            <Box>
              <Text size="2">Roles to Exclude</Text>
              <Flex direction="column" gap="1">
                {ROLE_LIST.map((role) => {
                  const EXCLUDE_LIST = ['vigilante'];
                  const disabled = EXCLUDE_LIST.includes(role);

                  return (
                    <CheckboxCard
                      css={{ width: '100%', opacity: disabled ? 0.5 : 1 }}
                      disabled={disabled}
                      defaultChecked={initialConfig.rolesToExclude.includes(
                        role
                      )}
                      onCheckedChange={handleToggleRole(role)}
                    >
                      <Text>{role}</Text>
                    </CheckboxCard>
                  );
                })}
              </Flex>
            </Box>
            <Button size="3" color="primary" onClick={handlePressSave}>
              Save
            </Button>
          </Flex>
        </form>
      </Flex>
    </Card>
  );
};
