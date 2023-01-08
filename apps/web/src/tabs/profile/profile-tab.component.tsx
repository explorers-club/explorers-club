import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { FC } from 'react';
import { ProfileTabActor } from './profile-tab.machine';

interface Props {
  actor: ProfileTabActor;
}

export const ProfileTabComponent: FC<Props> = ({ actor }) => {
  return (
    <Flex direction="column" css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Caption>Profile</Caption>
      </Card>
    </Flex>
  );
};
