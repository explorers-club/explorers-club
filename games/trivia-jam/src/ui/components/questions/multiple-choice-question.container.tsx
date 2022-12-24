import { TRIVIA_JAM_SUBMIT_RESPONSE } from '@explorers-club/room';
import { IMultipleChoiceFields } from '@explorers-club/contentful-types';
import { useCallback } from 'react';
import {
  useCurrentQuestionFields,
  useSend,
} from '../../../state/trivia-jam.hooks';
import { MultipleChoiceQuestionComponent } from './multiple-choice-question.component';

export const MultipleChoiceQuestion = () => {
  const fields =
    useCurrentQuestionFields<IMultipleChoiceFields>('multipleChoice');
  const send = useSend();

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
    <MultipleChoiceQuestionComponent
      fields={fields}
      onSubmitResponse={handleSubmit}
    />
  );
};
