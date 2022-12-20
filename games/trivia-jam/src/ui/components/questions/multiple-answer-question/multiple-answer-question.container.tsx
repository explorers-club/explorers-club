import { TRIVIA_JAM_SUBMIT_RESPONSE } from '@explorers-club/commands';
import { IMultipleAnswerFields } from '@explorers-club/contentful-types';
import { useTriviaJamRoom } from 'games/trivia-jam/src/state/trivia-jam.hooks';
import { IQuestion } from 'games/trivia-jam/src/types';
import { unwrapFields } from 'games/trivia-jam/src/utils';
import { FC, useCallback, useMemo } from 'react';
import { MultipleAnswerQuestionComponent } from './multiple-answer-question.component';

interface Props {
  question: IQuestion;
}

export const MultipleAnswerQuestion: FC<Props> = ({ question }) => {
  const room = useTriviaJamRoom();

  const { prompt, correctAnswers, incorrectAnswers } =
    unwrapFields<IMultipleAnswerFields>(question, 'multipleAnswer');

  // todo shuffle these
  const answers = useMemo(
    () => [...(correctAnswers || []), ...(incorrectAnswers || [])],
    [correctAnswers, incorrectAnswers]
  );

  const handleSubmit = useCallback(
    (selectedAnswers: string[]) => {
      room.send(TRIVIA_JAM_SUBMIT_RESPONSE, { response: selectedAnswers });
    },
    [room]
  );

  return (
    <MultipleAnswerQuestionComponent
      prompt={prompt}
      answers={answers}
      onSubmitResponse={handleSubmit}
    />
  );
};
