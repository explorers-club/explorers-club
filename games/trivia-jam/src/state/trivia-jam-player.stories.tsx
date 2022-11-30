import { useMemo } from '@storybook/addons';
import { Story } from '@storybook/react';
import { RenderMachine } from 'storybook-xstate-addon/RenderMachine';
import {
  createTriviaJamPlayerMachine,
  TriviaJamPlayerContext,
} from './trivia-jam-player.machine';

export default {
  title: 'State/Trivia Jam Player',
};

const Template: Story<{ context: TriviaJamPlayerContext }> = (args) => {
  const machine = useMemo(() => {
    return createTriviaJamPlayerMachine().withContext(args.context);
  }, [args]);
  return <RenderMachine machine={machine} />;
};

export const Default = Template.bind({});

Default.args = {
  context: {
    playerName: 'Foobar',
  },
};

Default.parameters = {
  xstate: true,
};
