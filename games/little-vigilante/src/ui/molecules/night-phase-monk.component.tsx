import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { FC } from 'react';

interface Props {
  role: string;
}

export const NightPhaseMonkComponent: FC<Props> = ({ role }) => {
  return (
    <Flex direction="column" gap="3">
      <Caption>Monk</Caption>
      <Text>
        You are the {role !== 'monk' ? 'now the ' : 'still the '}
        <strong>{role}</strong>.
      </Text>
    </Flex>
  );
};
