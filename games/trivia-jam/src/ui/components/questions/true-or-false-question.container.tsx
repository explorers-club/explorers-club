import { TRIVIA_JAM_SUBMIT_RESPONSE } from '@explorers-club/commands';
import { ITrueOrFalseFields } from '@explorers-club/contentful-types';
import { useCallback } from 'react';
import {
  useCurrentQuestionFields,
  useSend,
} from '../../../state/trivia-jam.hooks';
import { TrueOrFalseQuestionComponent } from './true-or-false-question.component';

export const TrueOrFalseQuestion = () => {
  const send = useSend();
  const fields = useCurrentQuestionFields<ITrueOrFalseFields>('trueOrFalse');

  const handleSubmit = useCallback(
    (response: boolean) => {
      send({ type: TRIVIA_JAM_SUBMIT_RESPONSE, response });
    },
    [send]
  );

  if (!fields) {
    return null;
  }

  return (
    <TrueOrFalseQuestionComponent
      fields={fields}
      onSubmitResponse={handleSubmit}
    />
  );
};
