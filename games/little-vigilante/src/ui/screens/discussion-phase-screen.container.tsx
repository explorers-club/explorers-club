import { useLittleVigilanteSelector } from '../../state/little-vigilante.hooks';
import { DiscussionPhaseScreenComponent } from './discussion-phase-screen.component';

export const DiscussionPhaseScreen = () => {
  const timeRemaining = useLittleVigilanteSelector(
    (state) => state.timeRemaining
  );
  return <DiscussionPhaseScreenComponent timeRemaining={timeRemaining} />;
};
