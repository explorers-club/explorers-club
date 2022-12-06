import { IMultipleAnswerFields } from '@explorers-club/contentful-types';
import { useMemo } from 'react';
import { MultipleAnswerQuestionComponent } from '../../components/questions/multiple-answer-question';
import { useCurrentQuestion } from './question-screen.hooks';
import { unwrapFields } from './utils';

export const MultipleAnswerQuestion = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentQuestion = useCurrentQuestion()!;

  const { prompt, correctAnswers, incorrectAnswers } =
    unwrapFields<IMultipleAnswerFields>(currentQuestion, 'multipleAnswer');

  // todo shuffle these
  const answers = useMemo(
    () => [...(correctAnswers || []), ...(incorrectAnswers || [])],
    [correctAnswers, incorrectAnswers]
  );

  return <MultipleAnswerQuestionComponent prompt={prompt} answers={answers} />;
};
