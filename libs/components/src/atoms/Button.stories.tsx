// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Button } from './Button';
import { Box } from './Box';
import { Flex } from './Flex';
import { Heading } from './Heading';

export default {
  component: Button,
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
    fullWidth: {
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    ghost: {
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    size: {
      defaultValue: false,
      control: {
        type: 'select',
        options: [1, 2, 3],
      },
    },
    color: {
      defaultValue: '',
      control: {
        type: 'select',
        options: [
          'primary',
          'secondary',
          'neutral',
          'error',
          'success',
          'warning',
          'info',
        ],
      },
    },
  },
} as ComponentMeta<typeof Button>;

export const Primary: ComponentStory<typeof Button> = (props) => (
  <Button {...props}>Button</Button>
);

export const Size: ComponentStory<typeof Button> = (props) => (
  <Box>
    <Heading css={{ mb: '$6' }}>Different Sizes</Heading>
    <Flex css={{ gap: '$5', fw: 'wrap', mt: '$6' }}>
      <Button {...props} size="1">
        Size 1
      </Button>
      <Button {...props} size="2">
        Size 2
      </Button>
      <Button {...props} size="3">
        Size 3
      </Button>
    </Flex>
  </Box>
);
export const FullWidth: ComponentStory<typeof Button> = (props) => (
  <Box>
    <Heading css={{ mb: '$6' }}>Different Sizes</Heading>

    <Button {...props} size="2" css={{ mb: '$4' }}>
      Normal
    </Button>
    <Button {...props} size="2" fullWidth>
      Full Width
    </Button>
  </Box>
);
export const Variants: ComponentStory<typeof Button> = (props) => (
  <Box>
    <Heading css={{ mb: '$6' }}>Different Colors</Heading>
    <Flex css={{ gap: '$5', fw: 'wrap', mt: '$6' }}>
      <Button {...props} color="primary">
        Primary
      </Button>
      <Button {...props} color="secondary">
        Secondary
      </Button>
      <Button {...props} color="neutral">
        Neutral
      </Button>
      <Button {...props} color="error">
        Error
      </Button>
      <Button {...props} color="info">
        Info
      </Button>
      <Button {...props} color="warning">
        Warning
      </Button>
      <Button {...props} color="success">
        Success
      </Button>
    </Flex>
  </Box>
);

export const States: ComponentStory<typeof Button> = (props) => (
  <Box>
    <Heading css={{ mb: '$6' }}>Different Colors</Heading>
    <Flex css={{ gap: '$5', fw: 'wrap', mt: '$6' }}>
      <Button {...props} state="active">
        Active
      </Button>
      <Button {...props} state="waiting">
        Waiting
      </Button>
    </Flex>
  </Box>
);

export const Ghost: ComponentStory<typeof Button> = (props) => (
  <Box>
    <Heading css={{ mb: '$6' }}>Ghost Buttons</Heading>
    <Flex css={{ gap: '$5', fw: 'wrap', mt: '$6' }}>
      <Button {...props} ghost color="primary">
        Primary
      </Button>
      <Button {...props} ghost color="secondary">
        Secondary
      </Button>
      <Button {...props} ghost color="neutral">
        Neutral
      </Button>
      <Button {...props} ghost color="error">
        Error
      </Button>
      <Button {...props} ghost color="info">
        Info
      </Button>
      <Button {...props} ghost color="warning">
        Warning
      </Button>
      <Button {...props} color="success" ghost>
        Success
      </Button>
    </Flex>
  </Box>
);
