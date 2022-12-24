import { TRIVIA_JAM_SUBMIT_RESPONSE } from '@explorers-club/room';
import { INumberInputFields } from '@explorers-club/contentful-types';
import { useCallback } from 'react';
import {
  useCurrentQuestionFields,
  useSend,
} from '../../../state/trivia-jam.hooks';
import { NumberInputQuestionComponent } from './number-input-question.component';

export const NumberInputQuestion = () => {
  const send = useSend();
  const fields = useCurrentQuestionFields<INumberInputFields>('numberInput');

  const handleSubmit = useCallback(
    (response: number) => {
      send({ type: TRIVIA_JAM_SUBMIT_RESPONSE, response });
    },
    [send]
  );

  if (!fields) {
    return null;
  }

  return (
    <NumberInputQuestionComponent
      fields={fields}
      onSubmitResponse={handleSubmit}
    />
  );
};
