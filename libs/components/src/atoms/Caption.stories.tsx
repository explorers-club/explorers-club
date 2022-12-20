import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Caption } from './Caption';
import { Box } from './Box';
import { Heading } from './Heading';

export default {
  component: Caption,

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
        options: ['contrast', 'low_contrast'],
      },
    },
  },
} as ComponentMeta<typeof Caption>;

export const Default: ComponentStory<typeof Caption> = (props) => (
  <Box>
    <Caption {...props}>Default Caption</Caption>
  </Box>
);

export const Components: ComponentStory<typeof Caption> = (props) => (
  <Box>
    <Heading css={{ mb: '$3' }}>paragraph</Heading>
    <Caption {...props} as="p">
      paragraph
    </Caption>
    <Heading css={{ mt: '$6', mb: '$3' }}>Caption</Heading>
    <Caption {...props} as="caption">
      Table Caption
    </Caption>
    <Heading css={{ mt: '$6', mb: '$3' }}>Link ({'<a>'} tag)</Heading>
    <Caption {...props} as="a">
      Link {'<a>'}{' '}
    </Caption>
  </Box>
);

export const Sizes: ComponentStory<typeof Caption> = (props) => (
  <Box>
    <Heading css={{ mb: '$3' }}>Sizes</Heading>
    <Caption {...props} size="1" css={{ mb: '$3' }}>
      Size 1
    </Caption>

    <Caption {...props} size="2" css={{ mb: '$3' }}>
      Size 2
    </Caption>
  </Box>
);

export const Variants: ComponentStory<typeof Caption> = (props) => (
  <Box>
    <Heading css={{ mb: '$3' }}>Variants</Heading>

    <Caption {...props} variant="contrast" css={{ mb: '$3' }}>
      Contrast
    </Caption>
    <Caption {...props} variant="low_contrast" css={{ mb: '$3' }}>
      Low contrast (Default)
    </Caption>
  </Box>
);
