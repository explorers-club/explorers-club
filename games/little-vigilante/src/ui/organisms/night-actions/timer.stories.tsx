import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import {
  LittleVigilanteStory,
  withLittleVigilanteContext,
} from '../../../test/withLittleVigilanteContext';
import { Timer } from './timer.component';

export default {
  component: Timer,
  decorators: [withCardDecorator, withLittleVigilanteContext],
};

const Template: LittleVigilanteStory = () => {
  return <Timer />;
};

export const Down = Template.bind({});

Down.args = {
  myUserId: 'alice123',
  state: {
    currentDownState: {
      alice123: true,
    },
    lastDownState: {},
  },
};

export const LastDown1SecondAgo = Template.bind({});

LastDown1SecondAgo.args = {
  myUserId: 'alice123',
  state: {
    currentTick: 100 + 1 * 60,
    currentDownState: {},
    lastDownState: {
      alice123: 100,
    },
  },
};

export const LastDown6SecondAgo = Template.bind({});

LastDown6SecondAgo.args = {
  myUserId: 'alice123',
  state: {
    currentTick: 100 + 6 * 60,
    currentDownState: {},
    lastDownState: {
      alice123: 100,
    },
  },
};
