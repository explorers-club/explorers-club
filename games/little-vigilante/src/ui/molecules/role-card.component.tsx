import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Image } from '@atoms/Image';
import { Text } from '@atoms/Text';
import { CSS } from '@explorers-club/styles';
import { FC } from 'react';
import {
  abilityByRole,
  displayNameByRole, getFullImageByRole, objectiveByRole, Role
} from '../../meta/little-vigilante.constants';
import { RoleAvatar } from './role-avatar.component';

interface Props {
  css?: CSS;
  role: Role;
}

export const RoleCard: FC<Props> = ({ css, role }) => {
  const imageSrc = getFullImageByRole(role);
  const ability = abilityByRole[role];
  const objective = objectiveByRole[role];

  return (
    <Card css={{ aspectRatio: 1, ...css }}>
      <Flex
        css={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: '$3',
          pt: '$8',
          background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))',
        }}
        align="end"
        justify="between"
        gap="2"
      >
        <Flex direction="column" gap="2">
          <Heading
            css={{
              textTransform: 'capitalize',
              textShadow: '0px 2px 1px $colors$neutral1',
            }}
            size="2"
          >
            {displayNameByRole[role]}
          </Heading>
          <Caption>Ability</Caption>
          <Text>{ability}</Text>
          <Caption>Objective</Caption>
          <Text>{objective}</Text>
        </Flex>
        <RoleAvatar roleType={role} />
      </Flex>
      <Image src={imageSrc} alt={role} />
    </Card>
  );
};
