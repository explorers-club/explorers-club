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
  const questionSetEntryRef = useRef<HTMLSelectElement>(null);
  const handlePressSave = useCallback(() => {
    const questionSetEntryId = questionSetEntryRef.current?.value;
    if (questionSetEntryId) {
      onSubmitConfig({
        questionSetEntryId,
      });
    }
  }, [onSubmitConfig]);

  return (
    <Card css={{ p: '$3' }}>
      <Flex direction="column" gap="2">
        <Caption>Configure</Caption>
        <Heading size="3">Game Settings</Heading>
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
        <Button size="3" color="primary" onClick={handlePressSave}>
          Save
        </Button>
      </Flex>
    </Card>
  );
};
