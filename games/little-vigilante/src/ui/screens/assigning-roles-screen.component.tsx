import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { FC } from 'react';
import { Role } from '../../meta/little-vigilante.constants';
import { RoleAssignment } from '../molecules/role-assignment';
import { Chat } from '../organisms/chat.component';

interface Props {
  role: Role;
}

export const AssigningRolesScreenComponent: FC<Props> = ({ role }) => {
  return (
    <Flex gap="2" direction="column">
      <Card css={{ flexGrow: 1, display: 'flex' }}>
        <RoleAssignment />
      </Card>
      <Card css={{ flexGrow: 1, display: 'flex' }}>
        <Chat disabled />
      </Card>
    </Flex>
  );
};
