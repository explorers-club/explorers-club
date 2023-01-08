import { useSelector } from '@xstate/react';
import { FC } from 'react';
import { Button } from '../../atoms/Button';
import { Flex } from '../../atoms/Flex';
import { Heading } from '../../atoms/Heading';
import { NotificationItemActor } from './notification-item.machine';

interface Props {
  actor: NotificationItemActor;
}

export const NotificationItemComponent: FC<Props> = ({ actor }) => {
  const options = useSelector(actor, (state) => state.context.options);

  const { primaryCtaLabel, type } = options;
  return (
    <Flex direction="column">
      <Heading>{type}</Heading>
      <Button>{primaryCtaLabel || 'Okay'}</Button>
    </Flex>
  );
};
