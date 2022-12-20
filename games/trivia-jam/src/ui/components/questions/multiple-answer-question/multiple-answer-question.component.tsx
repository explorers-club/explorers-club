import { Button } from '@atoms/Button';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { CheckboxCard } from '@molecules/CheckboxCard';
import { FC, useCallback, useRef } from 'react';

interface Props {
  prompt: string;
  answers: string[];
  onSubmitResponse: (selectAnswers: string[]) => void;
}

export const MultipleAnswerQuestionComponent: FC<Props> = ({
  prompt,
  answers,
  onSubmitResponse,
}) => {
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
    <Flex direction="column" gap="2">
      <Heading size="4">{prompt}</Heading>
      <Flex direction="column" gap="2">
        {answers.map((answer) => {
          return (
            <CheckboxCard
              onCheckedChange={handleCheckChange(answer)}
              key={answer}
            >
              {answer}
            </CheckboxCard>
          );
        })}
      </Flex>
    </Flex>
  );
};
