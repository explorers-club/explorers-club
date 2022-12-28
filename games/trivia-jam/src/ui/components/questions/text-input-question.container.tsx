import { TRIVIA_JAM_SUBMIT_RESPONSE } from '@explorers-club/room';
import { ITextInputFields } from '@explorers-club/contentful-types';
import { useCallback } from 'react';
import {
  useCurrentQuestionFields,
  useSend,
} from '../../../state/trivia-jam.hooks';
import { TextInputQuestionComponent } from './text-input-question.component';

export const TextInputQuestion = () => {
  const send = useSend();
  const fields = useCurrentQuestionFields<ITextInputFields>('textInput');

  const handleSubmit = useCallback(
    (response: string) => {
      send({ type: TRIVIA_JAM_SUBMIT_RESPONSE, response });
    },
    [send]
  );

  if (!fields) {
    return null;
  }

  return (
    <TextInputQuestionComponent
      fields={fields}
      onSubmitResponse={handleSubmit}
    />
  );
};
