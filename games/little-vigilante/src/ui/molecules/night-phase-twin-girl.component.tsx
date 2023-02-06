import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { FC } from 'react';

interface Props {
  twinBoyPlayer?: string;
}

export const NightPhaseTwinGirlComponent: FC<Props> = ({ twinBoyPlayer }) => {
  return (
    <Flex direction="column" gap="3">
      <Caption>Twins</Caption>
      {!twinBoyPlayer ? (
        <Text>You are the only twin</Text>
      ) : (
        <Text>
          <strong>{twinBoyPlayer}</strong> is your twin.
        </Text>
      )}
    </Flex>
  );
};
