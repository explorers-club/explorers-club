import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { FC } from 'react';
import { displayNameByRole, Role } from '../../meta/little-vigilante.constants';

interface Props {
  unusedRole: string;
}

export const NightPhaseVigilanteComponent: FC<Props> = ({ unusedRole }) => {
  return (
    <Flex direction="column" gap="3">
      <Caption>Vigilante</Caption>
      <Text>
        <strong>{displayNameByRole[unusedRole as Role]}</strong> is not being
        played by another player
      </Text>
    </Flex>
  );
};
