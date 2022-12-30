import { Heading } from './Heading';
import { IconButton } from './IconButton';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Flex } from './Flex';
import { Crosshair1Icon } from '@radix-ui/react-icons';

export default {
  component: IconButton,

  argTypes: {
    size: {
      defaultValue: '1',
      control: {
        type: 'select',
        options: ['1', '2', '3', '4'],
      },
    },

    state: {
      defaultValue: '',
      control: {
        type: 'select',
        options: ['default', 'active', 'waiting'],
      },
    },
    variant: {
      defaultValue: '',
      control: {
        type: 'select',
        options: ['default', 'ghost', 'raised'],
      },
    },
  },
} as ComponentMeta<typeof IconButton>;

export const Default: ComponentStory<typeof IconButton> = (props) => (
  <Flex direction="column" align="start">
    <IconButton {...props} css={{ mb: '$2' }}>
      <Crosshair1Icon />
    </IconButton>
  </Flex>
);
export const variants: ComponentStory<typeof IconButton> = (props) => (
  <Flex direction="column" align="start">
    <Heading>Ghost</Heading>
    <IconButton {...props} css={{ mb: '$2' }} variant="ghost">
      <Crosshair1Icon />
    </IconButton>
    <Heading>Raised</Heading>
    <IconButton {...props} css={{ mb: '$2' }} variant="raised">
      <Crosshair1Icon />
    </IconButton>
  </Flex>
);

export const Different_States: ComponentStory<typeof IconButton> = (props) => (
  <Flex direction="column" align="start">
    <Heading>Active</Heading>
    <IconButton {...props} css={{ mb: '$3' }} state="active">
      <Crosshair1Icon />
    </IconButton>
    <Heading>Waiting</Heading>
    <IconButton {...props} css={{ mb: '$3' }} state="waiting">
      <Crosshair1Icon />
    </IconButton>
    <Heading>Ghost Active</Heading>
    <IconButton {...props} css={{ mb: '$3' }} variant="ghost" state="active">
      <Crosshair1Icon />
    </IconButton>
    <Heading>Ghost Waiting</Heading>
    <IconButton {...props} css={{ mb: '$3' }} variant="ghost" state="waiting">
      <Crosshair1Icon />
    </IconButton>
    <Heading>Raised Active </Heading>
    <IconButton {...props} css={{ mb: '$3' }} variant="raised" state="active">
      <Crosshair1Icon />
    </IconButton>
    <Heading>Raised Waiting</Heading>
    <IconButton {...props} css={{ mb: '$3' }} variant="raised" state="waiting">
      <Crosshair1Icon />
    </IconButton>
  </Flex>
);
