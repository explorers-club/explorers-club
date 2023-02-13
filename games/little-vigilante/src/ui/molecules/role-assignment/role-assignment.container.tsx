import { Role } from '../../../meta/little-vigilante.constants';
import {
  useLittleVigilanteSelector,
  useMyUserId,
} from '../../../state/little-vigilante.hooks';
import { selectRoles } from '../../../state/little-vigilante.selectors';
import { RoleAssignmentComponent } from './role-assignment.component';

export const RoleAssignment = () => {
  const myUserId = useMyUserId();
  const myRole = useLittleVigilanteSelector(
    (state) => state.currentRoundRoles[myUserId] as Role
  );
  const roles = useLittleVigilanteSelector(selectRoles);

  return <RoleAssignmentComponent myRole={myRole} roles={roles} />;
};
