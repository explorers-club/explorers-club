import { useTriviaJamStoreSelector } from '../../state/trivia-jam.hooks';
import { QuestionScreen } from './question-screen.container';
import { ReviewScreen } from './review-screen.container';
import { ScoreboardScreen } from './scoreboard-screen.container';

export const PlayScreen = () => {
  const states = useTriviaJamStoreSelector((state) => state.currentStates);

  switch (true) {
    case states.includes('Playing.AwaitingQuestion'):
      return <ScoreboardScreen />;
    case states.includes('Playing.Question.Presenting'):
      return <QuestionScreen />;
    case states.includes('Playing.Question.Reviewing'):
      return <ReviewScreen />;
    default:
      return null;
  }
};
