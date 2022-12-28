import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Select } from '@atoms/Select';
import { Text } from '@atoms/Text';
import { IQuestionSetFields } from '@explorers-club/contentful-types';
import { TriviaJamConfigSerialized } from '@explorers-club/room';
import { Entry } from 'contentful';
import { FC, useCallback, useRef } from 'react';

interface Props {
  questionSetEntries: Entry<IQuestionSetFields>[];
  initialConfig: TriviaJamConfigSerialized;
  onSubmitConfig: (config: TriviaJamConfigSerialized) => void;
}

export const TriviaJamConfigurationScreenComponent: FC<Props> = ({
  questionSetEntries,
  initialConfig,
  onSubmitConfig,
}) => {
  const maxPlayersEntryRef = useRef<HTMLSelectElement>(null);

  const questionSetEntryRef = useRef<HTMLSelectElement>(null);
  const handlePressSave = useCallback(() => {
    const questionSetEntryId = questionSetEntryRef.current?.value;
    const maxPlayers = maxPlayersEntryRef.current?.value;
    // todo use zod here for parsing and validation
    if (maxPlayers && questionSetEntryId) {
      onSubmitConfig({
        questionSetEntryId,
        maxPlayers: parseInt(maxPlayers),
      });
    }
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
                const MAX_PLAYERS = 10;
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
          <Text size="2">Question Set</Text>
          <Select
            ref={questionSetEntryRef}
            defaultValue={initialConfig.questionSetEntryId}
          >
            {questionSetEntries.map((entry) => {
              return (
                <option key={entry.sys.id} value={entry.sys.id}>
                  {entry.fields.name}
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
