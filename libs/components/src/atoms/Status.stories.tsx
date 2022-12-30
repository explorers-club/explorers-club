import { Flex } from './Flex';
import { Status } from './Status';
import { Box } from './Box';
import { Heading } from './Heading';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Status,

  argTypes: {
    size: {
      defaultValue: '1',
      control: {
        type: 'select',
        options: ['1', '2'],
      },
    },
    variant: {
      defaultValue: 'gray',
      control: {
        type: 'select',
        options: ['gray', 'blue', 'green', 'yellow', 'red'],
      },
    },
  },
} as ComponentMeta<typeof Status>;

export const Default: ComponentStory<typeof Status> = (props) => (
  <Box {...props} css={{ p: '$3' }}>
    <Heading css={{ mb: '$2' }}>Player statuses</Heading>
    <Flex align="center">
      <Status {...props} variant="gray" css={{ mr: '$2' }} />
      offline
    </Flex>
    <Flex align="center">
      <Status {...props} variant="blue" css={{ mr: '$2' }} />
      playing
    </Flex>
    <Flex align="center">
      <Status {...props} variant="green" css={{ mr: '$2' }} />
      active
    </Flex>
    <Flex align="center">
      <Status {...props} variant="yellow" css={{ mr: '$2' }} />
      afk
    </Flex>
    <Flex align="center">
      <Status {...props} variant="red" css={{ mr: '$2' }} />
      do not disturb
    </Flex>
  </Box>
);
export const Sizes: ComponentStory<typeof Status> = (props) => (
  <Box {...props} css={{ p: '$3' }}>
    <Heading css={{ mb: '$2' }}>Player statuses</Heading>

    <Flex align="center">
      <Status {...props} size="1" css={{ mr: '$2' }} />
      size 1
    </Flex>

    <Flex align="center">
      <Status {...props} size="2" css={{ mr: '$2' }} />
      size 2
    </Flex>
  </Box>
);
