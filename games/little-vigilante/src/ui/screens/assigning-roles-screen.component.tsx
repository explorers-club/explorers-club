import { Box } from '@atoms/Box';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { FC } from 'react';
import { Role } from '../../meta/little-vigilante.constants';
import { RoleCard } from '../molecules/role-card.component';
import { Chat } from '../organisms/chat.component';

interface Props {
  role: Role;
}

export const AssigningRolesScreenComponent: FC<Props> = ({ role }) => {
  return (
    <Flex gap="2" direction="column">
      <RoleCard role={role} />
      <Card css={{ flexGrow: 1, display: 'flex' }}>
        <Chat disabled />
      </Card>
    </Flex>
  );
};
