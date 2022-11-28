import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { IntroductionScreen } from './introduction/introduction-screen.container';
import { QuestionScreen } from './question/question-screen.container';
import { ScoreboardScreen } from './scoreboard/scoreboard-screen.container';
import { ScreensContext } from './screens.context';
import {
  selectIsShowingIntroduction,
  selectIsShowingQuestion,
  selectIsShowingScoreboard,
} from './screens.selectors';

export const ScreensComponent = () => {
  const { screensActor } = useContext(ScreensContext);

  const isShowingIntroduction = useSelector(
    screensActor,
    selectIsShowingIntroduction
  );
  const isShowingQuestion = useSelector(screensActor, selectIsShowingQuestion);
  const isShowingScoreboard = useSelector(
    screensActor,
    selectIsShowingScoreboard
  );

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
