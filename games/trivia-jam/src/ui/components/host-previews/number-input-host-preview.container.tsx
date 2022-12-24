import { INumberInputFields } from '@explorers-club/contentful-types';
import { CONTINUE } from '@explorers-club/room';
import { useCallback } from 'react';
import {
  useCurrentQuestionFields, useSend, useTriviaJamStoreSelector
} from '../../../state/trivia-jam.hooks';
import { selectResponsesByPlayerName } from '../../../state/trivia-jam.selectors';
import { NumberInputHostPreviewComponent } from './number-input-host-preview.component';

export const NumberInputHostPreview = () => {
  const fields = useCurrentQuestionFields<INumberInputFields>('numberInput');

  const send = useSend();
  const responsesByPlayerName = useTriviaJamStoreSelector(
    selectResponsesByPlayerName<number>
  );
  const handleContinue = useCallback(() => {
    send({ type: CONTINUE });
  }, [send]);

  if (!fields) {
    return null;
  }

  return (
    <NumberInputHostPreviewComponent
      onContinue={handleContinue}
      responsesByPlayerName={responsesByPlayerName}
      fields={fields}
    />
  );
};
