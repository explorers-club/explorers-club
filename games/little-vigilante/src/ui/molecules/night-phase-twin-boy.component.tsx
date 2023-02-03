import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { FC } from 'react';

interface Props {
  twinGirlPlayer?: string;
}

export const NightPhaseTwinBoyComponent: FC<Props> = ({ twinGirlPlayer }) => {
  return (
    <Flex direction="column" gap="3">
      <Caption>Twins</Caption>
      {!twinGirlPlayer ? (
        <Text>You are the only twin</Text>
      ) : (
        <Text>
          <strong>{twinGirlPlayer}</strong> is your twin.
        </Text>
      )}
    </Flex>
  );
};
