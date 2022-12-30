// Discussion on storybook reuse https://github.com/storybookjs/storybook/issues/15954
import { Flex } from './Flex';
import { Card } from './Card';
import { Box } from './Box';
import { Text } from './Text';
import { Avatar } from './Avatar';
import { Image } from './Image';
import { Heading } from './Heading';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Card,

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
} as ComponentMeta<typeof Card>;

export const Default: ComponentStory<typeof Card> = (props) => (
  <Card {...props} css={{ p: '$3' }}>
    <Heading css={{ mb: '$2' }}>Explorers Club is a Play Company</Heading>
    <Text size="3" css={{ lineHeight: '23px' }}>
      This is a card. Use it anywhere you can use where typically would want a
      div/view but want some simple styling that fits with the theme. Cards are
      interactive and have hover / press visualizations.
    </Text>
  </Card>
);

export const Interactive: ComponentStory<typeof Card> = (props) => (
  <Card as="a" href="#" css={{ p: '$3' }} variant="interactive">
    <Heading css={{ mb: '$2' }}>Explorers Club is a Play Company</Heading>
    <Text size="3" css={{ lineHeight: '23px' }}>
      This is a card. Use it anywhere you can use where typically would want a
      div/view but want some simple styling that fits with the theme. Cards are
      interactive and have hover / press visualizations.
    </Text>
    <Flex css={{ ai: 'center', jc: 'space-between', mt: '$3' }}>
      <Flex css={{ ai: 'center' }}>
        <Avatar
          size="2"
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          css={{
            mr: '$1',
          }}
        />
        <Text size="2">Inspector T</Text>
      </Flex>
      <Box>
        <Text size="2">May 2020</Text>
      </Box>
    </Flex>
  </Card>
);

export const GhostInteractive: ComponentStory<typeof Card> = (props) => (
  <Card as="a" href="#" variant="ghost" css={{ p: '$3' }}>
    <Image
      src="https://images.unsplash.com/photo-1453235421161-e41b42ebba05?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2550&q=80"
      css={{ br: '$1', mb: '$3' }}
    />
    <Heading css={{ mb: '$2' }}>Explorers Club is a Play Company</Heading>
    <Text size="3" css={{ lineHeight: '23px' }}>
      This is a card. Use it anywhere you can use where typically would want a
      div/view but want some simple styling that fits with the theme. Cards are
      interactive and have hover / press visualizations.
    </Text>
    <Flex css={{ ai: 'center', jc: 'space-between', mt: '$3' }}>
      <Flex css={{ ai: 'center' }}>
        <Avatar
          size="2"
          alt="John Smith"
          src="https://i.pravatar.cc/400"
          fallback="J"
          css={{
            mr: '$1',
          }}
        />
        <Text size="2">Inspector T</Text>
      </Flex>
      <Box>
        <Text size="2">May 2020</Text>
      </Box>
    </Flex>
  </Card>
);

export const GraphicHeader: ComponentStory<typeof Card> = (props) => (
  <Card as="a" href="#" variant="interactive">
    <Image
      src="https://images.unsplash.com/photo-1453235421161-e41b42ebba05?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2550&q=80"
      css={{ btlr: '$3', btrr: '$3' }}
    />
    <Box css={{ p: '$3' }}>
      <Text size="3" css={{ lineHeight: '23px' }}>
        This is a card. Use it anywhere you can use where typically would want a
        div/view but want some simple styling that fits with the theme. Cards
        are interactive and have hover / press visualizations.
      </Text>
      <Flex css={{ ai: 'center', jc: 'space-between', mt: '$3' }}>
        <Flex css={{ ai: 'center' }}>
          <Avatar
            size="2"
            alt="John Smith"
            src="https://i.pravatar.cc/400"
            fallback="J"
            css={{
              mr: '$1',
            }}
          />
          <Text size="2">Inspector T</Text>
        </Flex>
        <Box>
          <Text size="2">May 2020</Text>
        </Box>
      </Flex>
    </Box>
  </Card>
);

export const Active: ComponentStory<typeof Card> = (props) => (
  <Card as="button" variant="active" css={{ p: '$3' }}>
    <Text size="3" css={{ lineHeight: '23px', fontWeight: 500 }}>
      Default Variants
    </Text>
    <Text size="3" css={{ lineHeight: '23px' }}>
      Explorers Club, Limited.
    </Text>
  </Card>
);
