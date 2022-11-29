import { useSelector } from '@xstate/react';
import { FC } from 'react';
import { IntroductionScreen } from './introduction/introduction-screen.container';
import { QuestionScreen } from './question/question-screen.container';
import { ScoreboardScreen } from './scoreboard/scoreboard-screen.container';
import { ScreensActor } from './screens.machine';
import {
  selectIsShowingIntroduction,
  selectIsShowingQuestion,
  selectIsShowingScoreboard,
} from './screens.selectors';

interface Props {
  actor: ScreensActor;
}

export const ScreensComponent: FC<Props> = ({ actor }) => {
  const isShowingIntroduction = useSelector(actor, selectIsShowingIntroduction);
  const isShowingQuestion = useSelector(actor, selectIsShowingQuestion);
  const isShowingScoreboard = useSelector(actor, selectIsShowingScoreboard);

  switch (true) {
    case isShowingIntroduction: {
      return <IntroductionScreen />;
    }
    case isShowingQuestion: {
      return <QuestionScreen />;
    }
    case isShowingScoreboard: {
      return <ScoreboardScreen />;
    }
    default: {
      return null;
    }
  }
};
