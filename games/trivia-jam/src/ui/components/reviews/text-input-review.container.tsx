import { ITextInputFields } from '@explorers-club/contentful-types';
import { useCurrentQuestionFields } from '../../../state/trivia-jam.hooks';
import { TextInputReviewComponent } from './text-input-review.component';

export const TextInputReview = () => {
  const fields = useCurrentQuestionFields<ITextInputFields>('textInput');

  if (!fields) {
    return null;
  }

  return <TextInputReviewComponent fields={fields} />;
};
