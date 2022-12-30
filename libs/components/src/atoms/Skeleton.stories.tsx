import { Box } from './Box';
import { Skeleton } from './Skeleton';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Skeleton,

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
} as ComponentMeta<typeof Skeleton>;

export const Default: ComponentStory<typeof Skeleton> = (props) => (
  <Box>
    <Skeleton variant="title" css={{ mb: '$3' }} />

    <Skeleton variant="avatar6" css={{ mb: '$3' }} />

    <Skeleton variant="button" css={{ mb: '$3' }} />

    <Skeleton variant="heading" css={{ mb: '$3' }} />
    <Skeleton variant="text" css={{ mb: '$3' }} />
    <Skeleton variant="text" css={{ mb: '$3' }} />
    <Skeleton variant="text" css={{ mb: '$3' }} />
    <Skeleton variant="text" css={{ mb: '$3' }} />
  </Box>
);
