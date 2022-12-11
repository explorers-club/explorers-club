import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { MenuComponent } from './menu.component';

export default { component: MenuComponent } as Meta;

export const Primary: ComponentStory<typeof MenuComponent> = (args) => {
  return <MenuComponent />;
};
