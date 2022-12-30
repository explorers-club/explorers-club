import { Box } from './Box';
import { Subheading } from './Subheading';

import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Heading } from './Heading';

export default {
  component: Subheading,

  argTypes: {
    gradient: {
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    size: {
      defaultValue: '1',
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
          'contrast',
          'low_contrast',
          'blue',
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
} as ComponentMeta<typeof Subheading>;

export const Default: ComponentStory<typeof Subheading> = (props) => (
  <Box>
    <Subheading {...props}>
      The quick brown fox jumped over the lazy dog
    </Subheading>
  </Box>
);
export const Sizes: ComponentStory<typeof Subheading> = (props) => (
  <Box>
    <Subheading {...props} size="1" css={{ mb: '$2' }}>
      Subheading size 1
    </Subheading>
    <Subheading {...props} size="2" css={{ mb: '$2' }}>
      Subheading size 2
    </Subheading>
    <Subheading {...props} size="3" css={{ mb: '$2' }}>
      Subheading size 3
    </Subheading>
    <Subheading {...props} size="4" css={{ mb: '$2' }}>
      Subheading size 4
    </Subheading>
  </Box>
);
export const Variants: ComponentStory<typeof Subheading> = (props) => (
  <Box>
    <Heading css={{ mb: '$2' }}>Different Variants </Heading>
    <Subheading {...props} variant="contrast" css={{ mb: '$2' }}>
      contrast
    </Subheading>
    <Subheading {...props} variant="low_contrast" css={{ mb: '$2' }}>
      low_contrast
    </Subheading>
    <Subheading {...props} variant="blue" css={{ mb: '$2' }}>
      blue
    </Subheading>
    <Subheading {...props} variant="crimson" css={{ mb: '$2' }}>
      crimson
    </Subheading>
    <Subheading {...props} variant="cyan" css={{ mb: '$2' }}>
      cyan
    </Subheading>
    <Subheading {...props} variant="gold" css={{ mb: '$2' }}>
      gold
    </Subheading>
    <Subheading {...props} variant="gray" css={{ mb: '$2' }}>
      gray
    </Subheading>
    <Subheading {...props} variant="green" css={{ mb: '$2' }}>
      green
    </Subheading>
    <Subheading {...props} variant="indigo" css={{ mb: '$2' }}>
      indigo
    </Subheading>
    <Subheading {...props} variant="lime" css={{ mb: '$2' }}>
      lime
    </Subheading>
    <Subheading {...props} variant="orange" css={{ mb: '$2' }}>
      orange
    </Subheading>
    <Subheading {...props} variant="pink" css={{ mb: '$2' }}>
      pink
    </Subheading>
    <Subheading {...props} variant="purple" css={{ mb: '$2' }}>
      purple
    </Subheading>
    <Subheading {...props} variant="red" css={{ mb: '$2' }}>
      red
    </Subheading>
    <Subheading {...props} variant="teal" css={{ mb: '$2' }}>
      teal
    </Subheading>
    <Subheading {...props} variant="violet" css={{ mb: '$2' }}>
      violet
    </Subheading>
    <Subheading {...props} variant="yellow" css={{ mb: '$2' }}>
      yellow
    </Subheading>
    <Subheading {...props} gradient css={{ mb: '$2' }}>
      Gradient
    </Subheading>
  </Box>
);
