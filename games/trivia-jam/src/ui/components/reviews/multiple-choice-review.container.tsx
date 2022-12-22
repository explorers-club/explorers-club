import { IMultipleChoiceFields } from '@explorers-club/contentful-types';
import { useCurrentQuestionFields } from '../../../state/trivia-jam.hooks';
import { MultipleChoiceReviewComponent } from './multiple-choice-review.component';

export const MultipleChoiceReview = () => {
  const fields =
    useCurrentQuestionFields<IMultipleChoiceFields>('multipleChoice');

  if (!fields) {
    return null;
  }

  return <MultipleChoiceReviewComponent fields={fields} />;
};
