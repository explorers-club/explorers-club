/* eslint-disable jsx-a11y/aria-role */
import {
  useLittleVigilanteSelector,
  useMyUserId,
} from '../../state/little-vigilante.hooks';
import { NightPhaseScreenComponent } from './night-phase-screen.component';

export const NightPhaseScreen = () => {
  const states = useLittleVigilanteSelector((state) => state.currentStates);
  const myUserId = useMyUserId();
  const myRole = useLittleVigilanteSelector(
    (state) => state.currentRoundRoles[myUserId]
  );

  switch (true) {
    case states.includes('Playing.Round.NightPhase.Vigilante') &&
      myRole === 'vigilante':
      return <NightPhaseScreenComponent role="vigilante" />;
    case states.includes('Playing.Round.NightPhase.Sidekick') &&
      myRole === 'sidekick':
      return <NightPhaseScreenComponent role="sidekick" />;
    case states.includes('Playing.Round.NightPhase.Jester') &&
      myRole === 'jester':
      return <NightPhaseScreenComponent role="jester" />;
    case states.includes('Playing.Round.NightPhase.Cop') && myRole === 'cop':
      return <NightPhaseScreenComponent role="cop" />;
    case states.includes('Playing.Round.NightPhase.Detective') &&
      myRole === 'detective':
      return <NightPhaseScreenComponent role="detective" />;
    case states.includes('Playing.Round.NightPhase.Butler') &&
      myRole === 'butler':
      return <NightPhaseScreenComponent role="butler" />;
    case states.includes('Playing.Round.NightPhase.Mayor') &&
      myRole === 'mayor':
      return <NightPhaseScreenComponent role="butler" />;
    default:
      return null;
  }
};
