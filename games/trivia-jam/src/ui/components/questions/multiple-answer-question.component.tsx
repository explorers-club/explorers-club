import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { IMultipleAnswerFields } from '@explorers-club/contentful-types';
import { CheckboxCard } from '@molecules/CheckboxCard';
import { FC, useCallback, useMemo, useRef } from 'react';

interface Props {
  fields: IMultipleAnswerFields;
  onSubmitResponse: (selectAnswers: string[]) => void;
}

export const MultipleAnswerQuestionComponent: FC<Props> = ({
  fields,
  onSubmitResponse,
}) => {
  const { correctAnswers, incorrectAnswers, prompt } = fields;
  const answers = useMemo(() => {
    // TODO shuffle these
    return [...(correctAnswers || []), ...(incorrectAnswers || [])];
  }, [correctAnswers, incorrectAnswers]);
  const selectedAnswersRef = useRef<Record<string, boolean>>({});

  const handleCheckChange = useCallback(
    (answer: string) => {
      return (value: boolean) => {
        selectedAnswersRef.current[answer] = value;

        const selectedAnswers = Object.entries(selectedAnswersRef.current)
          .filter(([_, value]) => value)
          .map(([answer]) => answer);
        onSubmitResponse(selectedAnswers);
      };
    },
    [selectedAnswersRef, onSubmitResponse]
  );

  return (
    <Flex direction="column" gap="2" css={{ p: '$3' }}>
      <Caption>Select all that apply</Caption>
      <Heading size="2">{prompt}</Heading>
      <Flex direction="column" gap="2">
        {answers.map((answer) => {
          return (
            <CheckboxCard
              onCheckedChange={handleCheckChange(answer)}
              key={answer}
            >
              <Text>{answer}</Text>
            </CheckboxCard>
          );
        })}
      </Flex>
    </Flex>
  );
};
