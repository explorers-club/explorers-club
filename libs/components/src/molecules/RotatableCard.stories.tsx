import { Avatar } from '@atoms/Avatar';
import { Box } from '@atoms/Box';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Image } from '@atoms/Image';
import { Text } from '@atoms/Text';

import {
  BackContent,
  CenterContent,
  LeftContent,
  RightContent,
  RotatableCard,
} from './RotatableCard';

export default {
  component: RotatableCard,
};

export const Primary = () => {
  return (
    <Flex justify="center">
      <RotatableCard css={{ width: '500px', height: '500px' }}>
        <CenterContent href="#" variant="interactive">
          <Image
            src="https://images.unsplash.com/photo-1453235421161-e41b42ebba05?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2550&q=80"
            css={{ btlr: '$3', btrr: '$3' }}
          />
          <Box css={{ p: '$3' }}>
            <Text size="3" css={{ lineHeight: '23px' }}>
              This is a card. Use it anywhere you can use where typically would
              want a div/view but want some simple styling that fits with the
              theme. Cards are interactive and have hover / press
              visualizations.
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
        </CenterContent>
        <RightContent css={{ p: '$3' }}>
          <Heading css={{ mb: '$2' }}>Explorers Club is a Play Company</Heading>
          <Text size="3" css={{ lineHeight: '23px' }}>
            This is a card. Use it anywhere you can use where typically would
            want a div/view but want some simple styling that fits with the
            theme. Cards are interactive and have hover / press visualizations.
          </Text>
        </RightContent>
        <BackContent
          as="a"
          href="#"
          variant="ghost"
          css={{ p: '$3', background: '$gray10' }}
        >
          <Image
            src="https://images.unsplash.com/photo-1453235421161-e41b42ebba05?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2550&q=80"
            css={{ br: '$1', mb: '$3' }}
          />
          <Heading css={{ mb: '$2' }}>Explorers Club is a Play Company</Heading>
          <Text size="3" css={{ lineHeight: '23px' }}>
            This is a card. Use it anywhere you can use where typically would
            want a div/view but want some simple styling that fits with the
            theme. Cards are interactive and have hover / press visualizations.
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
        </BackContent>
        <LeftContent href="#" css={{ p: '$3' }}>
          <Heading css={{ mb: '$2' }}>Explorers Club is a Play Company</Heading>
          <Text size="3" css={{ lineHeight: '23px' }}>
            This is a card. Use it anywhere you can use where typically would
            want a div/view but want some simple styling that fits with the
            theme. Cards are interactive and have hover / press visualizations.
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
        </LeftContent>
      </RotatableCard>
    </Flex>
  );
};
