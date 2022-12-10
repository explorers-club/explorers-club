import { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { <%= name %>Component } from './<%= propertyName %>.component';

export default { component: <%= name %> } as Meta;

export const Primary: ComponentStory<typeof <%= name %>Component> = (args) => {
  return <<%= name %>Component />;
};
