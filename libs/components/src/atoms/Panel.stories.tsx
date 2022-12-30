import { Box } from './Box';
import { Panel } from './Panel';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Text } from './Text';

export default {
  component: Panel,

  argTypes: {
    as: {
      control: {
        type: null,
      },
    },
    ref: {
      control: {
        type: null,
      },
    },

    variant: {
      defaultValue: '',
      control: {
        type: 'select',
        options: ['default', 'interactive', 'ghost', 'active'],
      },
    },
  },
} as ComponentMeta<typeof Panel>;

export const Default: ComponentStory<typeof Panel> = (props) => (
  <Box>
    <Panel css={{ p: '$3' }}>
      <Text>This is an example of Panel</Text>
    </Panel>
  </Box>
);
