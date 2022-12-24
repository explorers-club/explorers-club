import { TRIVIA_JAM_SUBMIT_RESPONSE } from '@explorers-club/room';
import { IMultipleAnswerFields } from '@explorers-club/contentful-types';
import { useCallback } from 'react';
import {
  useCurrentQuestionFields,
  useSend,
} from '../../../state/trivia-jam.hooks';
import { MultipleAnswerQuestionComponent } from './multiple-answer-question.component';

export const MultipleAnswerQuestion = () => {
  const send = useSend();
  const fields =
    useCurrentQuestionFields<IMultipleAnswerFields>('multipleAnswer');

  const handleSubmit = useCallback(
    (response: string[]) => {
      send({ type: TRIVIA_JAM_SUBMIT_RESPONSE, response });
    },
    [send]
  );

  if (!fields) {
    return null;
  }

  return (
    <MultipleAnswerQuestionComponent
      fields={fields}
      onSubmitResponse={handleSubmit}
    />
  );
};
