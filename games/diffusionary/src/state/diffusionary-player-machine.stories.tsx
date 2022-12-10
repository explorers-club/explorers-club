import { useMemo } from '@storybook/addons';
import { Meta, Story } from '@storybook/react';
import { RenderMachine } from 'storybook-xstate-addon/RenderMachine';
import {
  DiffusionaryPlayerContext,
  diffusionaryPlayerMachine,
} from './diffusionary-player.machine';

export default {
  title: 'State/DiffusionaryPlayer',
} as Meta;

const Template: Story<{ context: DiffusionaryPlayerContext }> = (args) => {
  const machine = useMemo(() => {
    return diffusionaryPlayerMachine.withContext(args.context);
  }, [args]);
  return <RenderMachine machine={machine} />;
};

export const Default = Template.bind({});

Default.args = {
  context: {
    playerName: undefined,
  },
};
