import { Box } from './Box';
import { Heading } from './Heading';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Heading,

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
    gradient: {
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    size: {
      defaultValue: null,
      control: {
        type: 'select',
        options: ['1', '2', '3', '4'],
      },
    },

    variant: {
      defaultValue: '',
      control: {
        type: 'select',
        options: [
          'default',
          'blue',
          'contrast',
          'low_contrast',
          'crimson',
          'cyan',
          'gold',
          'gray',
          'green',
          'indigo',
          'lime',
          'orange',
          'pink',
          'purple',
          'red',
          'teal',
          'violet',
          'yellow',
        ],
      },
    },
  },
} as ComponentMeta<typeof Heading>;

export const Default: ComponentStory<typeof Heading> = (props) => (
  <Heading {...props} css={{ mb: '$2' }}>
    Default Heading
  </Heading>
);
export const Sizes: ComponentStory<typeof Heading> = (props) => (
  <Box>
    <Heading {...props} size="1" css={{ mb: '$2' }}>
      size 1
    </Heading>
    <Heading {...props} size="2" css={{ mb: '$2' }}>
      size 2
    </Heading>
    <Heading {...props} size="3" css={{ mb: '$2' }}>
      size 3
    </Heading>
    <Heading {...props} size="4" css={{ mb: '$2' }}>
      size 4
    </Heading>
  </Box>
);
export const Gradient: ComponentStory<typeof Heading> = (props) => (
  <Box>
    <Heading {...props} gradient size="3" css={{ mb: '$2' }}>
      Gradiant Heading
    </Heading>
  </Box>
);
