import { Role } from '../../meta/little-vigilante.constants';
import {
  useLittleVigilanteSelector,
  useMyUserId,
} from '../../state/little-vigilante.hooks';
import { AssigningRolesScreenComponent } from './assigning-roles-screen.component';

export const AssigningRolesScreen = () => {
  const currentRoundRoles = useLittleVigilanteSelector(
    (state) => state.currentRoundRoles as Record<string, Role>
  );
  const userId = useMyUserId();
  const role = currentRoundRoles[userId];

  return <AssigningRolesScreenComponent role={role} />;
};
