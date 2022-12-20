import { contentfulClient } from '@explorers-club/contentful';
import { useQuery } from 'react-query';
import { useCurrentQuestionEntryId } from '../../state/trivia-jam.hooks';
import { IQuestionFields, IQuestion } from '../../types';
import { ReviewScreenComponent } from './review-screen.component';

export const ReviewScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const entryId = useCurrentQuestionEntryId()!;

  const query = useQuery(`entry-${entryId}`, async () => {
    return await contentfulClient.getEntry<IQuestionFields>(entryId);
  });

  if (!query.data) {
    return null;
  }

  return <ReviewScreenComponent question={query.data as IQuestion} />;
};
