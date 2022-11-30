import { useTriviaJamSharedActor } from '../state/game.hooks';
import { ScreensComponent } from './screens.component';

export const Screens = () => {
  const actor = useTriviaJamSharedActor();
  return <ScreensComponent actor={actor} />;
};
