import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { Heading } from '@atoms/Heading';
import { RadioCardGroup, ListRadioCard } from '@molecules/RadioCard';
import { FC, useCallback, useMemo } from 'react';
import { IMultipleChoiceFields } from '@explorers-club/contentful-types';
import { Caption } from '@atoms/Caption';

interface Props {
  fields: IMultipleChoiceFields;
  onSubmitResponse: (selectedAnswer: string) => void;
}

export const MultipleChoiceQuestionComponent: FC<Props> = ({
  fields,
  onSubmitResponse,
}) => {
  const { prompt, correctAnswer, incorrectAnswers } = fields;
  const handleChange = useCallback(
    (value: string) => {
      onSubmitResponse(value);
    },
    [onSubmitResponse]
  );

  const answers = useMemo(
    () => [correctAnswer, ...(incorrectAnswers || [])],
    [correctAnswer, incorrectAnswers]
  );

  return (
    <Flex direction="column" gap="2" css={{ p: '$3' }}>
      <Caption>Select one</Caption>
      <Heading size="2">{prompt}</Heading>
      <RadioCardGroup onValueChange={handleChange}>
        {[
          answers.map((answer, index) => (
            <ListRadioCard
              key={index}
              value={answer}
              css={{ mb: '$2', width: '100%' }}
            >
              <Flex css={{ alignItems: 'center' }}>
                <Text
                  size="5"
                  css={{ fontWeight: '500', lineHeight: '25px', mr: '$6' }}
                >
                  {answer}
                </Text>
              </Flex>
            </ListRadioCard>
          )),
        ]}
      </RadioCardGroup>
    </Flex>
  );
};
