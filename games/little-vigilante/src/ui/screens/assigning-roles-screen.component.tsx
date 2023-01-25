import { Box } from '@atoms/Box';
import { FC } from 'react';
import { Role } from '../../meta/little-vigilante.constants';
import { RoleCard } from '../molecules/role-card.component';

interface Props {
  role: Role;
}

export const AssigningRolesScreenComponent: FC<Props> = ({ role }) => {
  return (
    <Box css={{ p: '$2' }}>
      <RoleCard role={role} />
    </Box>
  );
};
