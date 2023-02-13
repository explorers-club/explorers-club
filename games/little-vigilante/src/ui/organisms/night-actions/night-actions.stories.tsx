import { withCardDecorator } from '@storybook-decorators/CardDecorator';
import {
  LittleVigilanteStory,
  withLittleVigilanteContext,
} from '../../../test/withLittleVigilanteContext';
import { NightActions } from './night-actions.component';

export default {
  component: NightActions,
  decorators: [withCardDecorator, withLittleVigilanteContext],
  parameters: {
    cardCSS: {
      p: '$0',
    },
  },
};

const Template: LittleVigilanteStory = () => {
  return <NightActions />;
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
