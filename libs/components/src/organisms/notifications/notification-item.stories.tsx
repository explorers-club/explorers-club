import { ComponentStory, Meta } from '@storybook/react';
import { useInterpret } from '@xstate/react';
import React from 'react';
import { NotificationItemComponent } from './notification-item.component';
import { createNotificationItemMachine } from './notification-item.machine';

export default { component: NotificationItemComponent } as Meta;

export const Primary: ComponentStory<typeof NotificationItemComponent> = (
  args
) => {
  const actor = useInterpret(
    createNotificationItemMachine({
      type: 'info',
      primaryCtaLabel: 'Go',
    })
  );
  return <NotificationItemComponent actor={actor} />;
};
