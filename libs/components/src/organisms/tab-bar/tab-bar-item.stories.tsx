import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { TabBarItemComponent } from './tab-bar-item.component';

export default { component: TabBarItemComponent } as Meta;

export const Primary: ComponentStory<typeof TabBarItemComponent> = (args) => {
  return <TabBarItemComponent />;
};
