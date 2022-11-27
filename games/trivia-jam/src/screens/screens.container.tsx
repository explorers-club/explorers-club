import { useInterpret } from '@xstate/react';
import { ScreensComponent } from './screens.compontent';
import { ScreensContext } from './screens.context';
import { screensMachine } from './screens.machine';

export const Screens = () => {
  const screensActor = useInterpret(screensMachine, {
    context: {},
  });

  return (
    <ScreensContext.Provider value={{ screensActor }}>
      <ScreensComponent />
    </ScreensContext.Provider>
  );
};
