import { CONTINUE } from '@explorers-club/commands';
import { ITrueOrFalseFields } from '@explorers-club/contentful-types';
import { useCallback } from 'react';
import {
  useCurrentQuestionFields,
  useSend,
  useStoreSelector,
} from '../../../state/trivia-jam.hooks';
import { selectResponsesByPlayerName } from '../../../state/trivia-jam.selectors';
import { TrueOrFalseHostPreviewComponent } from './true-or-false-host-preview.component';

export const TrueOrFalseHostPreview = () => {
  const fields = useCurrentQuestionFields<ITrueOrFalseFields>('trueOrFalse');
  const send = useSend();

  const handleContinue = useCallback(() => {
    send({ type: CONTINUE });
  }, [send]);
  const responsesByPlayerName = useStoreSelector(
    selectResponsesByPlayerName<boolean>
  );

  if (!fields) {
    return null;
  }
  return (
    <TrueOrFalseHostPreviewComponent
      onContinue={handleContinue}
      responsesByPlayerName={responsesByPlayerName}
      fields={fields}
    />
  );
};
