import { contentfulClient } from '@explorers-club/contentful';
import { useQuery } from 'react-query';
import { useCurrentQuestionEntryId } from '../../state/trivia-jam.hooks';
import { IQuestionFields, IQuestion } from '../../types';
import { QuestionScreenComponent } from './question-screen.component';

export const QuestionScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const entryId = useCurrentQuestionEntryId()!;

  const query = useQuery(`entry-${entryId}`, async () => {
    return await contentfulClient.getEntry<IQuestionFields>(entryId);
  });

  if (!query.data) {
    return null;
  }

  return <QuestionScreenComponent question={query.data as IQuestion} />;
};
