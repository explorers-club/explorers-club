import { Story } from '@storybook/react';
import { useMemo } from 'react';
import { RenderMachine } from 'storybook-xstate-addon/RenderMachine';
import {
  triviaJamSharedMachine,
  TriviaJamSharedContext,
} from './trivia-jam-shared.machine';

export default {
  title: 'State/Trivia Jam Shared',
};

const Template: Story<{ context: TriviaJamSharedContext }> = (args) => {
  const machine = useMemo(() => {
    return triviaJamSharedMachine.withContext(args.context).withConfig({
      services: {
        waitForAllPlayersLoaded: async () => {
          return;
        },
        waitForHostPressStart: async () => {
          return;
        },
      },
    });
  }, [args]);

  return <RenderMachine machine={machine} />;
};

export const Default = Template.bind({});

Default.args = {
  context: {
    playerUserIds: ['foo', 'buz', 'bar'],
    hostUserIds: ['bar'],
    scores: {
      buz: 4,
      bar: 2,
    },
  },
};
