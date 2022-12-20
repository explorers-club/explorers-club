import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Flex } from './Flex';
import { Box } from './Box';
import { Text } from './Text';
import { Avatar } from './Avatar';

export default {
  component: Avatar,

  argTypes: {
    inactive: {
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    interactive: {
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    size: {
      defaultValue: false,
      control: {
        type: 'select',
        options: [1, 2, 3, 4, 5, 6],
      },
    },
    shape: {
      defaultValue: 'circle',
      control: {
        type: 'select',
        options: ['circle', 'square'],
      },
    },
    variant: {
      defaultValue: '',
      control: {
        type: 'select',
        options: [
          'hiContrast',
          'gray',
          'tomato',
          'red',
          'crimson',
          'pink',
          'plum',
          'purple',
          'violet',
          'indigo',
          'blue',
          'cyan',
          'teal',
          'green',
          'grass',
          'brown',
          'bronze',
          'gold',
          'sky',
          'mint',
          'lime',
          'yellow',
          'amber',
          'orange',
        ],
      },
    },
  },
} as ComponentMeta<typeof Avatar>;

export const Default: ComponentStory<typeof Avatar> = (props) => (
  <Box css={{ p: '$3' }}>
    <Flex css={{ ai: 'center', gap: '$3', mb: '$3' }}>
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
      />
    </Flex>
    <Text size="3" css={{ lineHeight: '23px' }}>
      This is an avatar.
    </Text>
  </Box>
);

export const Sizes: ComponentStory<typeof Avatar> = (props) => (
  <Box css={{ p: '$3' }}>
    <Flex css={{ ai: 'center', gap: '$3', mb: '$3' }}>
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        size={1}
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        size={2}
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        size={3}
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        size={4}
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        size={5}
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        size={6}
      />
    </Flex>
    <Text size="3" css={{ lineHeight: '23px' }}>
      These are different sizes of avatars.
    </Text>
  </Box>
);

export const Variants: ComponentStory<typeof Avatar> = (props) => (
  <Box css={{ p: '$3' }}>
    <Flex css={{ ai: 'center', gap: '$3', mb: '$3' }}>
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="hiContrast"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="gray"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="tomato"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="red"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="crimson"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="pink"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="plum"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="purple"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="violet"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="indigo"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="blue"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="cyan"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="teal"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="green"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="grass"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="brown"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="bronze"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="gold"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="sky"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="mint"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="lime"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="yellow"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="amber"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        variant="orange"
      />
    </Flex>
    <Text size="3" css={{ lineHeight: '23px' }}>
      These are different variants of avatars. They have their respective
      background colors. use the most suitable according to the theme.
    </Text>
  </Box>
);

export const Shape: ComponentStory<typeof Avatar> = (props) => (
  <Box css={{ p: '$3' }}>
    <Flex css={{ ai: 'center', gap: '$3', mb: '$3' }}>
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        shape="circle"
        size="6"
      />
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        shape="square"
        size="6"
      />
    </Flex>
    <Text size="3" css={{ lineHeight: '23px' }}>
      Different shapes of avatars.
    </Text>
  </Box>
);

export const Inactive: ComponentStory<typeof Avatar> = (props) => (
  <Box css={{ p: '$3' }}>
    <Flex css={{ ai: 'center', gap: '$3', mb: '$3' }}>
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        inactive
        size="6"
      />
    </Flex>
    <Text size="3" css={{ lineHeight: '23px' }}>
      Inactive Avatar.
    </Text>
  </Box>
);

export const Interactive: ComponentStory<typeof Avatar> = (props) => (
  <Box css={{ p: '$3' }}>
    <Flex css={{ ai: 'center', gap: '$3', mb: '$3' }}>
      <Avatar
        {...props}
        alt="John Smith"
        src="https://i.pravatar.cc/400"
        fallback="J"
        interactive
        size="6"
      />
    </Flex>
    <Text size="3" css={{ lineHeight: '23px' }}>
      Interactive Avatar. Avatars are interactive and have hover / press
      visualizations.
    </Text>
  </Box>
);
