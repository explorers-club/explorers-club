import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { <%= uppercase(name) %> } from './<%= name %>.component';

export default { component: <%= uppercase(name) %> } as Meta;

export const Primary: ComponentStory<typeof <%= uppercase(name) %>> = (args) => {
  return <<%= uppercase(name) %> />;
};
