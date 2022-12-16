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
      options: ['gray', 'green', 'blue'],
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
      <Button size="1" {...props}>
        Size 1
      </Button>
      <Button size="2" {...props}>
        Size 2
      </Button>
      <Button size="3" {...props}>
        Size 3
      </Button>
    </Flex>
  </Box>
);
export const Colors: ComponentStory<typeof Button> = (props) => (
  <Box>
    <Heading css={{ mb: '$6' }}>Different Colors</Heading>
    <Flex css={{ gap: '$5', fw: 'wrap', mt: '$6' }}>
      <Button color="neutral" {...props}>
        Neutral
      </Button>
      <Button color="primary" {...props}>
        Primary
      </Button>
      <Button color="red" {...props}>
        Red
      </Button>
      <Button color="green" {...props}>
        Green
      </Button>
      <Button color="transparentBlack" {...props}>
        Transparent Black
      </Button>
      <Button color="transparentWhite" {...props}>
        Transparent White
      </Button>
    </Flex>
  </Box>
);

export const States: ComponentStory<typeof Button> = (props) => (
  <Box>
    <Heading css={{ mb: '$6' }}>Different Colors</Heading>
    <Flex css={{ gap: '$5', fw: 'wrap', mt: '$6' }}>
      <Button state="active" {...props}>
        Active
      </Button>
      <Button state="waiting" {...props}>
        Waiting
      </Button>
    </Flex>
  </Box>
);

export const Ghost: ComponentStory<typeof Button> = (props) => (
  <Box>
    <Heading css={{ mb: '$6' }}>Ghost Buttons</Heading>
    <Flex css={{ gap: '$5', fw: 'wrap', mt: '$6' }}>
      <Button ghost {...props}>
        Active
      </Button>
      <Button ghost color="red" {...props}>
        Active
      </Button>
      <Button ghost color="green" {...props}>
        Active
      </Button>
      {/* <Button ghost color="gray" {...props}>
        Active
      </Button>
      <Button ghost color="blue" {...props}>
        Active
      </Button> */}
    </Flex>
  </Box>
);
