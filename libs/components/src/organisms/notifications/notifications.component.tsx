import { useSelector } from '@xstate/react';
import React, { FC } from 'react';
import { Flex } from '../../atoms/Flex';
import { NotificationItemComponent } from './notification-item.component';
import { NotificationsActor } from './notifications.machine';

interface Props {
  actor: NotificationsActor;
}

export const NotificationsComponent: FC<Props> = ({ actor }) => {
  const notifications = useSelector(
    actor,
    (state) => state.context.notifications
  );

  return (
    <Flex direction="column">
      {notifications.map((actor, index) => (
        <NotificationItemComponent key={index} actor={actor} />
      ))}
    </Flex>
  );
};
