import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { RoleAssignment } from '../molecules/role-assignment';
import { Chat } from '../organisms/chat.component';

export const AssigningRolesScreenComponent = () => {
  return (
    <Flex gap="2" direction="column" css={{ minHeight: '100%' }}>
      <Card css={{ display: 'flex' }}>
        <RoleAssignment />
      </Card>
      <Card css={{ flexGrow: 1, display: 'flex' }}>
        <Chat disabled />
      </Card>
    </Flex>
  );
};
