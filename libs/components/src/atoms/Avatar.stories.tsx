import { Flex } from './Flex';
import { Box } from './Box';
import { Text } from './Text';
import { Avatar } from './Avatar';

export default {
  component: Avatar,
};

export const Default = {
  render: () => (
    <Box css={{ p: '$3' }}>
      <Flex css={{ ai: 'center', gap: '$3', mb: '$3' }}>
        <Avatar alt="John Smith" src="https://i.pravatar.cc/400" fallback="J" />
      </Flex>
      <Text size="3" css={{ lineHeight: '23px' }}>
        This is an avatar.
      </Text>
    </Box>
  ),
};

export const Sizes = {
  render: () => (
    <Box css={{ p: '$3' }}>
      <Flex css={{ ai: 'center', gap: '$3', mb: '$3' }}>
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          size={1}
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          size={2}
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          size={3}
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          size={4}
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          size={5}
        />
        <Avatar
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
  ),
};
export const Variants = {
  render: () => (
    <Box css={{ p: '$3' }}>
      <Flex css={{ ai: 'center', gap: '$3', mb: '$3' }}>
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="hiContrast"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="gray"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="tomato"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="red"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="crimson"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="pink"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="plum"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="purple"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="violet"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="indigo"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="blue"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="cyan"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="teal"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="green"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="grass"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="brown"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="bronze"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="gold"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="sky"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="mint"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="lime"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="yellow"
        />
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          variant="amber"
        />
        <Avatar
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
  ),
};

export const Shape = {
  render: () => (
    <Box css={{ p: '$3' }}>
      <Flex css={{ ai: 'center', gap: '$3', mb: '$3' }}>
        <Avatar
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          shape="circle"
          size="6"
        />
        <Avatar
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
  ),
};

export const Inactive = {
  render: () => (
    <Box css={{ p: '$3' }}>
      <Flex css={{ ai: 'center', gap: '$3', mb: '$3' }}>
        <Avatar
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
  ),
};

export const Interactive = {
  render: () => (
    <Box css={{ p: '$3' }}>
      <Flex css={{ ai: 'center', gap: '$3', mb: '$3' }}>
        <Avatar
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
  ),
};
