import { IMultipleAnswerFields } from '@explorers-club/contentful-types';
import { useCurrentQuestionFields } from '../../../state/trivia-jam.hooks';
import { MultipleAnswerReviewComponent } from './multiple-answer-review.component';

export const MultipleAnswerReview = () => {
  const fields =
    useCurrentQuestionFields<IMultipleAnswerFields>('multipleAnswer');

  if (!fields) {
    return null;
  }

  return <MultipleAnswerReviewComponent fields={fields} />;
};
