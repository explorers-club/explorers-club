import {
  useLittleVigilanteSelector,
  useMyUserId,
} from '../../state/little-vigilante.hooks';
import { NightPhaseMonkComponent } from './night-phase-monk.component';

export const NightPhaseMonk = () => {
  const myUserId = useMyUserId();
  const myRole = useLittleVigilanteSelector(
    (state) => state.currentRoundRoles[myUserId]
  );

  return <NightPhaseMonkComponent role={myRole} />;
};
