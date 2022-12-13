import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { IndexComponent } from './index.component';

export default { component: IndexComponent } as Meta;

export const Primary: ComponentStory<typeof IndexComponent> = (args) => {
  return <IndexComponent />;
};
