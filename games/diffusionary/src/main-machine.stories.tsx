import { useMemo } from '@storybook/addons';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { RenderMachine } from 'storybook-xstate-addon/RenderMachine';
import { MainContext, mainMachine } from './main.machine';

export default {
  title: 'State/Main',
} as Meta;

const Template: Story<{ context: MainContext }> = (args) => {
  const machine = useMemo(() => {
    return mainMachine.withContext(args.context);
  }, [args]);
  return <RenderMachine machine={machine} />;
};

export const Default = Template.bind({});

Default.args = {
  context: {},
};
