import { Box } from './Box';
import { Paragraph } from './Paragraph';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Paragraph,

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
        options: ['1', '2'],
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
} as ComponentMeta<typeof Paragraph>;

export const Default: ComponentStory<typeof Paragraph> = (props) => (
  <Box>
    <Paragraph {...props}>
      The quick brown fox jumped over the lazy dog
    </Paragraph>
  </Box>
);
export const Sizes: ComponentStory<typeof Paragraph> = (props) => (
  <Box>
    <Paragraph {...props} size="1" css={{ mb: '$2' }}>
      Size-1 : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} size="2" css={{ mb: '$2' }}>
      Size-2 :The quick brown fox jumped over the lazy dog
    </Paragraph>
  </Box>
);
export const Variants: ComponentStory<typeof Paragraph> = (props) => (
  <Box>
    <Paragraph {...props} variant="blue" css={{ mb: '$2' }}>
      variant='blue' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="contrast" css={{ mb: '$2' }}>
      variant='contrast' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="low_contrast" css={{ mb: '$2' }}>
      variant='low-contrast' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="crimson" css={{ mb: '$2' }}>
      variant='crimson' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="cyan" css={{ mb: '$2' }}>
      variant='cyan' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="gold" css={{ mb: '$2' }}>
      variant='gold' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="gray" css={{ mb: '$2' }}>
      variant='gray' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="green" css={{ mb: '$2' }}>
      variant='green' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="indigo" css={{ mb: '$2' }}>
      variant='indigo' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="lime" css={{ mb: '$2' }}>
      variant='lime' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="orange" css={{ mb: '$2' }}>
      variant='orange' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="pink" css={{ mb: '$2' }}>
      variant='pink' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="purple" css={{ mb: '$2' }}>
      variant='purple' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="red" css={{ mb: '$2' }}>
      variant='red' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="teal" css={{ mb: '$2' }}>
      variant='teal' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="violet" css={{ mb: '$2' }}>
      variant='violet' : The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} variant="yellow" css={{ mb: '$2' }}>
      variant='yellow' : The quick brown fox jumped over the lazy dog
    </Paragraph>
  </Box>
);

export const Gradient: ComponentStory<typeof Paragraph> = (props) => (
  <Box>
    {' '}
    <Paragraph {...props} css={{ mb: '$2' }}>
      Normal :The quick brown fox jumped over the lazy dog
    </Paragraph>
    <Paragraph {...props} gradient css={{ mb: '$2' }}>
      Gradient : The quick brown fox jumped over the lazy dog
    </Paragraph>
  </Box>
);
