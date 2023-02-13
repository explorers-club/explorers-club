import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { FC } from 'react';

interface Props {
  vigilante: string;
  sidekick?: string;
}

export const NightPhaseButlerComponent: FC<Props> = ({
  vigilante,
  sidekick,
}) => {
  return (
    <Flex direction="column" gap="3">
      <Caption>Butler</Caption>
      <Text>
        <strong>{vigilante}</strong> is the <strong>Vigilante</strong>.
      </Text>
      {sidekick && (
        <Text>
          <strong>{sidekick}</strong> is the <strong>Sidekick</strong>.
        </Text>
      )}
    </Flex>
  );
};
