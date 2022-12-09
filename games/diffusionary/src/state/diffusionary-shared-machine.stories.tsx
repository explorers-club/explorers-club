import { useMemo } from '@storybook/addons';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { RenderMachine } from 'storybook-xstate-addon/RenderMachine';
import {
  DiffusionarySharedContext,
  diffusionarySharedMachine,
} from './diffusionary-shared.machine';

export default {
  title: 'State/DiffusionaryShared',
} as Meta;

const Template: Story<{ context: DiffusionarySharedContext }> = (args) => {
  const machine = useMemo(() => {
    return diffusionarySharedMachine.withContext(args.context);
  }, [args]);
  return <RenderMachine machine={machine} />;
};

export const Default = Template.bind({});

Default.args = {
  context: {},
};
