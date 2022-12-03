import {
  useSharedCollectionActor,
  useTriviaJamSharedActor,
} from '../state/game.hooks';
import { ScreensComponent } from './screens.component';

/**
 * This component ensures we have a shared collection, with the trivia jam shared
 * actor and the actor for the local player.
 */
export const Screens = () => {
  const actor = useSharedCollectionActor();
  const triviaJamSharedActor = useTriviaJamSharedActor();

  // TODO generic loading in case shared actor isnt here, should be rare or fast
  if (!triviaJamSharedActor) {
    return null;
  }

  return <ScreensComponent sharedCollectionActor={actor} />;
};
