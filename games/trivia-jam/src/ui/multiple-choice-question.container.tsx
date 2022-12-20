import { TRIVIA_JAM_SUBMIT_RESPONSE } from '@explorers-club/commands';
import { IMultipleChoiceFields } from '@explorers-club/contentful-types';
import { FC, useCallback, useMemo } from 'react';
import { MultipleChoiceQuestionComponent } from '../components/questions/multiple-choice-question';
import { useTriviaJamRoom } from '../state/trivia-jam.hooks';
import { IQuestion } from '../types';
import { unwrapFields } from '../utils';

interface Props {
  question: IQuestion;
}

export const MultipleChoiceQuestion: FC<Props> = ({ question }) => {
  const room = useTriviaJamRoom();
  const handleSubmit = useCallback(
    (selection: string) => {
      room.send(TRIVIA_JAM_SUBMIT_RESPONSE, { response: selection });
    },
    [room]
  );

  const { prompt, correctAnswer, incorrectAnswers } =
    unwrapFields<IMultipleChoiceFields>(question, 'multipleChoice');

  // todo shuffle these
  const answers = useMemo(
    () => [correctAnswer, ...(incorrectAnswers || [])],
    [correctAnswer, incorrectAnswers]
  );

  return (
    <MultipleChoiceQuestionComponent
      prompt={prompt}
      answers={answers}
      onSubmitResponse={handleSubmit}
    />
  );
};
