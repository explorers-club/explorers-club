import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Flex } from './Flex';
import { Box } from './Box';

import { Badge } from './Badge';
import { Heading } from './Heading';

export default {
  component: Badge,

  argTypes: {
    interactive: {
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    size: {
      defaultValue: 1,
      control: {
        type: 'select',
        options: [1, 2],
      },
    },

    variant: {
      defaultValue: '',
      control: {
        type: 'select',
        options: [
          'gray',
          'red',
          'crimson',
          'pink',
          'purple',
          'violet',
          'indigo',
          'blue',
          'cyan',
          'teal',
          'green',
          'lime',
          'yellow',
          'orange',
          'gold',
          'bronze',
        ],
      },
    },
  },
} as ComponentMeta<typeof Badge>;

export const Default: ComponentStory<typeof Badge> = (props) => (
  <Box>
    <Heading>Default</Heading>
    <Flex css={{ gap: '$5', fw: 'wrap', mt: '$6' }}>
      <Badge {...props}>Default Badge</Badge>
    </Flex>
  </Box>
);

export const Sizes: ComponentStory<typeof Badge> = (props) => (
  <Box>
    <Heading>Default Badge</Heading>
    <Flex css={{ gap: '$5', fw: 'wrap', mt: '$6' }}>
      <Badge {...props} size="1">
        Size 1
      </Badge>
      <Badge {...props} size="2">
        Size 2
      </Badge>
    </Flex>
  </Box>
);

export const Variants: ComponentStory<typeof Badge> = (props) => (
  <Box>
    <Heading css={{ mb: '$6' }}>Interactive variant</Heading>
    <Flex css={{ gap: '$5', fw: 'wrap', mt: '$6' }}>
      <Badge {...props} variant="gray">
        {' '}
        gray
      </Badge>
      <Badge {...props} variant="red">
        {' '}
        red
      </Badge>
      <Badge {...props} variant="crimson">
        {' '}
        crimson
      </Badge>
      <Badge {...props} variant="pink">
        {' '}
        pink
      </Badge>
      <Badge {...props} variant="purple">
        {' '}
        purple
      </Badge>
      <Badge {...props} variant="violet">
        {' '}
        violet
      </Badge>
      <Badge {...props} variant="indigo">
        {' '}
        indigo
      </Badge>
      <Badge {...props} variant="blue">
        {' '}
        blue
      </Badge>
      <Badge {...props} variant="cyan">
        {' '}
        cyan
      </Badge>
      <Badge {...props} variant="teal">
        {' '}
        teal
      </Badge>
      <Badge {...props} variant="green">
        {' '}
        green
      </Badge>
      <Badge {...props} variant="lime">
        {' '}
        lime
      </Badge>
      <Badge {...props} variant="yellow">
        {' '}
        yellow
      </Badge>
      <Badge {...props} variant="orange">
        {' '}
        orange
      </Badge>
      <Badge {...props} variant="gold">
        {' '}
        gold
      </Badge>
      <Badge {...props} variant="bronze">
        {' '}
        bronze
      </Badge>
    </Flex>
  </Box>
);

export const InteractiveVariants: ComponentStory<typeof Badge> = (props) => (
  <Box>
    <Heading css={{ mb: '$6' }}>Interactive variant</Heading>
    <Flex css={{ gap: '$5', fw: 'wrap', mt: '$6' }}>
      <Badge {...props} interactive variant="gray">
        gray
      </Badge>
      <Badge {...props} interactive variant="red">
        red
      </Badge>
      <Badge {...props} interactive variant="crimson">
        crimson
      </Badge>
      <Badge {...props} interactive variant="pink">
        pink
      </Badge>
      <Badge {...props} interactive variant="purple">
        purple
      </Badge>
      <Badge {...props} interactive variant="violet">
        violet
      </Badge>
      <Badge {...props} interactive variant="indigo">
        indigo
      </Badge>
      <Badge {...props} interactive variant="blue">
        blue
      </Badge>
      <Badge {...props} interactive variant="cyan">
        cyan
      </Badge>
      <Badge {...props} interactive variant="teal">
        teal
      </Badge>
      <Badge {...props} interactive variant="green">
        green
      </Badge>
      <Badge {...props} interactive variant="lime">
        lime
      </Badge>
      <Badge {...props} interactive variant="yellow">
        yellow
      </Badge>
      <Badge {...props} interactive variant="orange">
        orange
      </Badge>
      <Badge {...props} interactive variant="gold">
        gold
      </Badge>
      <Badge {...props} interactive variant="bronze">
        bronze
      </Badge>
    </Flex>
  </Box>
);
