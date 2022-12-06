import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { FC, useMemo } from 'react';
import { CheckboxCard } from '@molecules/CheckboxCard';

interface Props {
  prompt: string;
  answers: string[];
}

export const MultipleAnswerQuestionComponent: FC<Props> = ({
  prompt,
  answers,
}) => {
  return (
    <Flex direction="column">
      <Heading size="4">{prompt}</Heading>
      <Flex direction="column">
        {answers.map((answer) => {
          return <CheckboxCard key={answer}>{answer}</CheckboxCard>;
        })}
      </Flex>
    </Flex>
  );
};
