import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { CONTINUE } from '@explorers-club/room';
import { GearIcon, ThickArrowRightIcon } from '@radix-ui/react-icons';
import { useCallback } from 'react';
import {
  useLittleVigilanteSend,
  useIsHost,
} from '../../state/little-vigilante.hooks';

export const HostControls = () => {
  const send = useLittleVigilanteSend();
  const isHost = useIsHost();
  const handlePressNext = useCallback(() => {
    send({ type: CONTINUE });
  }, [send]);

  if (!isHost) {
    return null;
  }

  return (
    <Flex gap="2" direction="column">
      <Caption>Host Controls</Caption>
      <Flex gap="2">
        <Button size="3">
          <GearIcon />
        </Button>
        <Button
          css={{ flexGrow: 1 }}
          size="3"
          color="primary"
          onClick={handlePressNext}
        >
          <Flex align="center" gap="1">
            <Text css={{ fontWeight: 'bold' }}>Start</Text>
            <ThickArrowRightIcon />
          </Flex>
        </Button>
      </Flex>
    </Flex>
  );
};
