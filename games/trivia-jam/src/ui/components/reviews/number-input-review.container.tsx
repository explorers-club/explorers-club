import { INumberInputFields } from '@explorers-club/contentful-types';
import { useCurrentQuestionFields } from '../../../state/trivia-jam.hooks';
import { NumberInputReviewComponent } from './number-input-review.component';

export const NumberInputReview = () => {
  const fields = useCurrentQuestionFields<INumberInputFields>('numberInput');

  if (!fields) {
    return null;
  }

  return <NumberInputReviewComponent fields={fields} />;
};
