import { IMultipleChoiceFields } from '@explorers-club/contentful-types';
import { useMemo } from 'react';
import { MultipleChoiceQuestionComponent } from '../../components/questions/multiple-choice-question';
import { useCurrentQuestion } from './question-screen.hooks';
import { unwrapFields } from './utils';

export const MultipleChoiceQuestion = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentQuestion = useCurrentQuestion()!;

  const { prompt, correctAnswer, incorrectAnswers } =
    unwrapFields<IMultipleChoiceFields>(currentQuestion, 'MultipleChoice');

  // todo shuffle these
  const answers = useMemo(
    () => [correctAnswer, ...(incorrectAnswers || [])],
    [correctAnswer, incorrectAnswers]
  );

  return <MultipleChoiceQuestionComponent prompt={prompt} answers={answers} />;
};
