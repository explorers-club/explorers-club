import { useSelector } from '@xstate/react';
import { FC } from 'react';
import { selectIsAwaitingQuestion, TriviaJamSharedActor } from '../state';
import { selectIsShowingQuestion } from '../state/trivia-jam-shared.selectors';
import { IntroductionScreen } from './introduction/introduction-screen.container';
import { QuestionScreen } from './question/question-screen.container';
import { ScoreboardScreen } from './scoreboard/scoreboard-screen.container';

interface Props {
  actor: TriviaJamSharedActor;
}

export const ScreensComponent: FC<Props> = ({ actor }) => {
  const isStaging = useSelector(actor, (state) => state.matches('Staging'));
  const isAwaitingQuestion = useSelector(actor, selectIsAwaitingQuestion);
  const isShowingQuestion = useSelector(actor, selectIsShowingQuestion);

  switch (true) {
    case isStaging: {
      return <IntroductionScreen />;
    }
    case isAwaitingQuestion: {
      return <ScoreboardScreen />;
    }
    case isShowingQuestion: {
      return <QuestionScreen />;
    }
    default: {
      return null;
    }
  }
};
