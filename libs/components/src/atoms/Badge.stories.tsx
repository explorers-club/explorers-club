import { Flex } from './Flex';
import { Box } from './Box';
import { Text } from './Text';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Heading } from './Heading';

export default {
  component: Badge,
};

export const Default = {
  render: () => (
    <Box>
      <Heading>Default</Heading>
      <Flex css={{ gap: '$5', fw: 'wrap', mt: '$6' }}>
        <Badge>Default Badge</Badge>
      </Flex>
    </Box>
  ),
};

export const Sizes = {
  render: () => (
    <Box>
      <Heading>Default Badge</Heading>
      <Flex css={{ gap: '$5', fw: 'wrap', mt: '$6' }}>
        <Badge size="1">Size 1</Badge>
        <Badge size="2">Size 2</Badge>
      </Flex>
    </Box>
  ),
};

export const Variants = {
  render: () => (
    <Box>
      <Heading css={{ mb: '$6' }}>Interactive variant</Heading>
      <Flex css={{ gap: '$5', fw: 'wrap', mt: '$6' }}>
        <Badge variant="gray"> gray</Badge>
        <Badge variant="red"> red</Badge>
        <Badge variant="crimson"> crimson</Badge>
        <Badge variant="pink"> pink</Badge>
        <Badge variant="purple"> purple</Badge>
        <Badge variant="violet"> violet</Badge>
        <Badge variant="indigo"> indigo</Badge>
        <Badge variant="blue"> blue</Badge>
        <Badge variant="cyan"> cyan</Badge>
        <Badge variant="teal"> teal</Badge>
        <Badge variant="green"> green</Badge>
        <Badge variant="lime"> lime</Badge>
        <Badge variant="yellow"> yellow</Badge>
        <Badge variant="orange"> orange</Badge>
        <Badge variant="gold"> gold</Badge>
        <Badge variant="bronze"> bronze</Badge>
      </Flex>
    </Box>
  ),
};

export const InteractiveVariants = {
  render: () => (
    <Box>
      <Heading css={{ mb: '$6' }}>Interactive variant</Heading>
      <Flex css={{ gap: '$5', fw: 'wrap', mt: '$6' }}>
        <Badge interactive variant="gray">
          gray
        </Badge>
        <Badge interactive variant="red">
          red
        </Badge>
        <Badge interactive variant="crimson">
          crimson
        </Badge>
        <Badge interactive variant="pink">
          pink
        </Badge>
        <Badge interactive variant="purple">
          purple
        </Badge>
        <Badge interactive variant="violet">
          violet
        </Badge>
        <Badge interactive variant="indigo">
          indigo
        </Badge>
        <Badge interactive variant="blue">
          blue
        </Badge>
        <Badge interactive variant="cyan">
          cyan
        </Badge>
        <Badge interactive variant="teal">
          teal
        </Badge>
        <Badge interactive variant="green">
          green
        </Badge>
        <Badge interactive variant="lime">
          lime
        </Badge>
        <Badge interactive variant="yellow">
          yellow
        </Badge>
        <Badge interactive variant="orange">
          orange
        </Badge>
        <Badge interactive variant="gold">
          gold
        </Badge>
        <Badge interactive variant="bronze">
          bronze
        </Badge>
      </Flex>
    </Box>
  ),
};
