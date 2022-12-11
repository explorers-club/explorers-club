import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { MobileLayoutComponent } from './mobile-layout.component';

export default { component: MobileLayoutComponent } as Meta;

export const Primary: ComponentStory<typeof MobileLayoutComponent> = (args) => {
  return <MobileLayoutComponent />;
};
