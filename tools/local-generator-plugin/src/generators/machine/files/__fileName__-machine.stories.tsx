import { useMemo } from '@storybook/addons';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { RenderMachine } from 'storybook-xstate-addon/RenderMachine';
import { <%= name %>Context, <%= propertyName %>Machine } from './<%= fileName %>.machine';

export default {
  title: "State/<%= name %>"
} as Meta

const Template: Story<{ context: <%= name %>Context }> = (args) => {
  const machine = useMemo(() => {
    return <%= propertyName %>Machine.withContext(args.context);
  }, [args]);
  return <RenderMachine machine={machine} />;
};

export const Default = Template.bind({});

Default.args = {
  context: {},
};
