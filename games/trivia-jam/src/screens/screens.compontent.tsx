import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { IntroductionScreen } from './introduction/introduction-screen.container';
import { ScreensContext } from './screens.context';
import { selectIsShowingIntroduction } from './screens.selectors';

export const ScreensComponent = () => {
  const { screensActor } = useContext(ScreensContext);

  const isShowingIntroduction = useSelector(
    screensActor,
    selectIsShowingIntroduction
  );

  switch (true) {
    case isShowingIntroduction: {
      return <IntroductionScreen />;
    }
    default: {
      return null;
    }
  }
};
