import { QuestionScreenComponent } from './question-screen.component';
import { useCurrentQuestion } from './question-screen.hooks';

export const QuestionScreen = () => {
  const currentQuestion = useCurrentQuestion();
  if (!currentQuestion) {
    // tood return loading
    return null;
  }

  return <QuestionScreenComponent question={currentQuestion} />;
};
