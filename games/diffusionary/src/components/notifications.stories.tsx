import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { NotificationsComponent } from './notifications.component';

export default { component: NotificationsComponent } as Meta;

export const Primary: ComponentStory<typeof NotificationsComponent> = (
  args
) => {
  return <NotificationsComponent />;
};
