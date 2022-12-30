import { Box } from './Box';
import { Text } from './Text';

import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Text,

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
      defaultValue: '1',
      control: {
        type: 'select',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
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
} as ComponentMeta<typeof Text>;

export const Default: ComponentStory<typeof Text> = (props) => (
  <Box>
    <Text {...props}>The quick brown fox jumped over the lazy dog</Text>
  </Box>
);

export const Sizes: ComponentStory<typeof Text> = (props) => (
  <Box>
    <Text {...props} size="1" css={{ mb: '$2' }}>
      Size-1 : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} size="2" css={{ mb: '$2' }}>
      Size-2 :The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} size="3" css={{ mb: '$2' }}>
      Size-3 :The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} size="4" css={{ mb: '$2' }}>
      Size-4 :The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} size="5" css={{ mb: '$2' }}>
      Size-5 :The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} size="6" css={{ mb: '$2' }}>
      Size-6 :The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} size="7" css={{ mb: '$2' }}>
      Size-7 :The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} size="8" css={{ mb: '$2' }}>
      Size-8 :The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} size="9" css={{ mb: '$2' }}>
      Size-9 :The quick brown fox jumped over the lazy dog
    </Text>
  </Box>
);
export const Variants: ComponentStory<typeof Text> = (props) => (
  <Box>
    <Text {...props} variant="blue" css={{ mb: '$2' }}>
      variant='blue' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="contrast" css={{ mb: '$2' }}>
      variant='contrast' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="low_contrast" css={{ mb: '$2' }}>
      variant='low-contrast' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="crimson" css={{ mb: '$2' }}>
      variant='crimson' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="cyan" css={{ mb: '$2' }}>
      variant='cyan' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="gold" css={{ mb: '$2' }}>
      variant='gold' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="gray" css={{ mb: '$2' }}>
      variant='gray' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="green" css={{ mb: '$2' }}>
      variant='green' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="indigo" css={{ mb: '$2' }}>
      variant='indigo' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="lime" css={{ mb: '$2' }}>
      variant='lime' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="orange" css={{ mb: '$2' }}>
      variant='orange' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="pink" css={{ mb: '$2' }}>
      variant='pink' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="purple" css={{ mb: '$2' }}>
      variant='purple' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="red" css={{ mb: '$2' }}>
      variant='red' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="teal" css={{ mb: '$2' }}>
      variant='teal' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="violet" css={{ mb: '$2' }}>
      variant='violet' : The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} variant="yellow" css={{ mb: '$2' }}>
      variant='yellow' : The quick brown fox jumped over the lazy dog
    </Text>
  </Box>
);

export const Gradient: ComponentStory<typeof Text> = (props) => (
  <Box>
    {' '}
    <Text {...props} css={{ mb: '$2' }}>
      Normal :The quick brown fox jumped over the lazy dog
    </Text>
    <Text {...props} gradient css={{ mb: '$2' }}>
      Gradient : The quick brown fox jumped over the lazy dog
    </Text>
  </Box>
);
