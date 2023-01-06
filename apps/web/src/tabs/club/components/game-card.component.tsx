import { Button } from '@atoms/Button';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { IconButton } from '@atoms/IconButton';
import { GearIcon } from '@radix-ui/react-icons';
import { FC } from 'react';

interface Props {
  name: string;
  onPressStart?: () => void;
  onPressConfigure?: () => void;
}

export const GameCardComponent: FC<Props> = ({
  name,
  onPressStart,
  onPressConfigure,
}) => {
  return (
    <Card>
      <Heading>{name}</Heading>
      {onPressStart && (
        <Flex gap="2">
          <Button
            size="3"
            color="primary"
            onClick={onPressStart}
            css={{ flex: '1' }}
          >
            Start
          </Button>
          <IconButton size="3" onClick={onPressConfigure}>
            <GearIcon />
          </IconButton>
        </Flex>
      )}
    </Card>
  );
};
