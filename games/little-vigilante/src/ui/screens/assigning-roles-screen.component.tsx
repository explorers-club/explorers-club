import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Image } from '@atoms/Image';
import { Text } from '@atoms/Text';
import { FC } from 'react';
import {
  imageByRole,
  objectiveByRole,
  Role,
} from '../../meta/little-vigilante.constants';

interface Props {
  role: Role;
}

export const AssigningRolesScreenComponent: FC<Props> = ({ role }) => {
  const imageSrc = imageByRole[role];
  const objective = objectiveByRole[role];
  return (
    <Box css={{ p: '$3' }}>
      <Card>
        <Flex direction="column" css={{ p: '$3' }} gap="2">
          <Heading>{role}</Heading>
          <Caption>Objective</Caption>
          <Text>{objective}</Text>
          <Image src={imageSrc} alt={role} />
        </Flex>
      </Card>
    </Box>
  );
};
