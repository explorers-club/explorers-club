import { useInterpret } from '@xstate/react';
import {
  useSharedCollectionActor,
  useTriviaJamSharedActor,
} from '../state/game.hooks';
import { ScreensComponent } from './screens.component';
import { screensMachine } from './screens.machine';

export const Screens = () => {
  const sharedCollectionActor = useSharedCollectionActor();
  const triviaJamSharedActor = useTriviaJamSharedActor();

  const screensActor = useInterpret(screensMachine, {
    context: {
      sharedCollectionActor,
      triviaJamSharedActor,
    },
  });

  return <ScreensComponent actor={screensActor} />;
};
