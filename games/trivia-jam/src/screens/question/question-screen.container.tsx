import { QuestionScreenComponent } from './question-screen.component';
import { useQuestionScreenActor } from './question-screen.hooks';

export const QuestionScreen = () => {
  const actor = useQuestionScreenActor();
  return <QuestionScreenComponent actor={actor} />;
};
