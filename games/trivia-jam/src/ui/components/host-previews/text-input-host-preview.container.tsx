import { CONTINUE } from '@explorers-club/commands';
import { ITextInputFields } from '@explorers-club/contentful-types';
import { FC, useCallback } from 'react';
import { useTriviaJamRoom } from '../../../state/trivia-jam.hooks';
import { IQuestion } from '../../../types';
import { unwrapFields } from '../../../utils';
import { TextInputHostPreviewComponent } from './text-input-host-preview.component';

interface Props {
  question: IQuestion;
}

export const TextInpuHostPreview: FC<Props> = ({ question }) => {
  const room = useTriviaJamRoom();

  const { prompt } = unwrapFields<ITextInputFields>(question, 'multipleAnswer');

  const handleContinue = useCallback(() => {
    room.send(CONTINUE);
  }, [room]);

  return (
    <TextInputHostPreviewComponent
      onContinue={handleContinue}
      prompt={prompt}
    />
  );
};
