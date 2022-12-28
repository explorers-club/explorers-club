import { useEntryQuery } from '../../queries/useEntryQuery';
import { useIsHost, useTriviaJamStoreSelector } from '../../state/trivia-jam.hooks';
import { IQuestionType } from '../../types';
import { QuestionScreenComponent } from './question-screen.component';

export const QuestionScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const entryId = useTriviaJamStoreSelector((state) => state.currentQuestionEntryId);
  const isHost = useIsHost();
  const query = useEntryQuery(entryId);

  if (!query.data) {
    return null;
  }

  const contentType = query.data.sys.contentType.sys.id as IQuestionType;

  return <QuestionScreenComponent contentType={contentType} isHost={isHost} />;
};
