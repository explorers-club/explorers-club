import {
  useLittleVigilanteSelector,
  useMyUserId
} from '../../state/little-vigilante.hooks';
import { NightPhaseMonkScreenComponent } from './night-phase-monk-screen.component';

export const NightPhaseMonkScreen = () => {
  const myUserId = useMyUserId();
  const myRole = useLittleVigilanteSelector(
    (state) => state.currentRoundRoles[myUserId]
  );

  return <NightPhaseMonkScreenComponent role={myRole} />;
};
