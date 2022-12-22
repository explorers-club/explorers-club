import { CONTINUE } from '@explorers-club/commands';
import { ITextInputFields } from '@explorers-club/contentful-types';
import { useCallback } from 'react';
import {
  useCurrentQuestionFields,
  useSend,
  useStoreSelector,
} from '../../../state/trivia-jam.hooks';
import { selectResponsesByPlayerName } from '../../../state/trivia-jam.selectors';
import { TextInputHostPreviewComponent } from './text-input-host-preview.component';

export const TextInputHostPreview = () => {
  const fields = useCurrentQuestionFields<ITextInputFields>('textInput');

  const send = useSend();
  const handleContinue = useCallback(() => {
    send({ type: CONTINUE });
  }, [send]);
  const responsesByPlayerName = useStoreSelector(
    selectResponsesByPlayerName<string>
  );

  if (!fields) {
    return null;
  }

  return (
    <TextInputHostPreviewComponent
      onContinue={handleContinue}
      responsesByPlayerName={responsesByPlayerName}
      fields={fields}
    />
  );
};
