import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { FC } from 'react';
import { displayNameByRole, Role } from '../../meta/little-vigilante.constants';

type Props =
  | {
      unusedRole: string;
      sidekickPlayer?: string;
    }
  | {
      unusedRole: undefined;
      sidekickPlayer: string;
    };

export const NightPhaseVigilanteComponent: FC<Props> = ({
  unusedRole,
  sidekickPlayer,
}) => {
  return (
    <Flex direction="column" gap="3">
      <Caption>Vigilantes</Caption>
      {sidekickPlayer ? (
        <Text>
          <strong>{sidekickPlayer}</strong> is your sidekick.
        </Text>
      ) : (
        <Text>
          <strong>{displayNameByRole[unusedRole as Role]}</strong> is not being
          played by another player
        </Text>
      )}
    </Flex>
  );
};
