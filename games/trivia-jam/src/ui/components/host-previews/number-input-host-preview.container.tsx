import { CONTINUE } from '@explorers-club/commands';
import { INumberInputFields } from '@explorers-club/contentful-types';
import { useCallback } from 'react';
import {
  useCurrentQuestionFields,
  useStoreSelector,
  useSend,
} from '../../../state/trivia-jam.hooks';
import { selectResponsesByPlayerName } from '../../../state/trivia-jam.selectors';
import { NumberInputHostPreviewComponent } from './number-input-host-preview.component';

export const NumberInputHostPreview = () => {
  const fields = useCurrentQuestionFields<INumberInputFields>('numberInput');

  const send = useSend();
  const responsesByPlayerName = useStoreSelector(
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
