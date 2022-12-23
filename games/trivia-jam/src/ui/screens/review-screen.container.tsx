import { CONTINUE } from '@explorers-club/commands';
import { useCallback } from 'react';
import { useEntryQuery } from '../../queries/useEntryQuery';
import {
  useIsHost,
  useTriviaJamStoreSelector,
  useSend,
} from '../../state/trivia-jam.hooks';
import { selectCurrentQuestionPointsByName } from '../../state/trivia-jam.selectors';
import { IQuestion } from '../../types';
import { ReviewScreenComponent } from './review-screen.component';

export const ReviewScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const entryId = useTriviaJamStoreSelector((state) => state.currentQuestionEntryId);
  const query = useEntryQuery(entryId);
  const isHost = useIsHost();

  const send = useSend();

  const currentQuestionPointsByName = useTriviaJamStoreSelector(
    selectCurrentQuestionPointsByName
  );

  const handleContinue = useCallback(() => {
    send({ type: CONTINUE });
  }, [send]);

  if (!query.data) {
    return null;
  }

  const question = query.data as IQuestion;
  const contentType = question.sys.contentType.sys.id;

  return (
    <ReviewScreenComponent
      fields={question.fields}
      contentType={contentType}
      currentQuestionPointsByName={currentQuestionPointsByName}
      showContinue={isHost}
      onPressContinue={handleContinue}
    />
  );
};
