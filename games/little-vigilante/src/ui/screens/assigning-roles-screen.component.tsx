import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Image } from '@atoms/Image';
import { Text } from '@atoms/Text';
import { Avatar } from '@atoms/Avatar';
import { FC } from 'react';
import {
  iconByRole,
  imageByRole,
  objectiveByRole,
  Role,
} from '../../meta/little-vigilante.constants';

interface Props {
  role: Role;
}

export const AssigningRolesScreenComponent: FC<Props> = ({ role }) => {
  const imageSrc = imageByRole[role];
  const iconSrc = iconByRole[role];
  const objective = objectiveByRole[role];
  return (
    <Box css={{ p: '$2' }}>
      <Card>
        <Flex
          css={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: '$3',
            background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))',
          }}
          align="end"
          justify="between"
          gap="2"
        >
          <Flex direction="column" gap="2">
            <Heading css={{ textTransform: 'capitalize' }} size="2">
              {role}
            </Heading>
            <Text>{objective}</Text>
          </Flex>
          <Avatar size="3" src={iconSrc} />
        </Flex>
        <Image src={imageSrc} alt={role} />
      </Card>
    </Box>
  );
};
