import { ITrueOrFalseFields } from '@explorers-club/contentful-types';
import { useCurrentQuestionFields } from '../../../state/trivia-jam.hooks';
import { TrueOrFalseReviewComponent } from './true-or-false-review.component';

export const TrueOrFalseReview = () => {
  const fields = useCurrentQuestionFields<ITrueOrFalseFields>('trueOrFalse');

  if (!fields) {
    return null;
  }

  return <TrueOrFalseReviewComponent fields={fields} />;
};
