import { CONTINUE } from '@explorers-club/commands';
import { IMultipleChoiceFields } from '@explorers-club/contentful-types';
import { useCallback } from 'react';
import {
  useCurrentQuestionFields,
  useSend,
  useTriviaJamStoreSelector,
} from '../../../state/trivia-jam.hooks';
import { selectResponsesByPlayerName } from '../../../state/trivia-jam.selectors';
import { MultipleChoiceHostPreviewComponent } from './multiple-choice-host-preview.component';

export const MultipleChoiceHostPreview = () => {
  const fields =
    useCurrentQuestionFields<IMultipleChoiceFields>('multipleChoice');

  const send = useSend();
  const responsesByPlayerName = useTriviaJamStoreSelector(
    selectResponsesByPlayerName<string>
  );
  const handleContinue = useCallback(() => {
    send({ type: CONTINUE });
  }, [send]);

  if (!fields) {
    return null;
  }

  return (
    <MultipleChoiceHostPreviewComponent
      onContinue={handleContinue}
      fields={fields}
      responsesByPlayerName={responsesByPlayerName}
    />
  );
};
