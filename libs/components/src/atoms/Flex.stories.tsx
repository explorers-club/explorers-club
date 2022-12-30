import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Box } from './Box';
import { Heading } from './Heading';
import { Flex } from './Flex';

export default {
  component: Flex,

  argTypes: {
    direction: {
      defaultValue: '',
      control: {
        type: 'select',
        options: ['row', 'column', 'rowReverse', 'columnReverse'],
      },
    },
    align: {
      defaultValue: '',
      control: {
        type: 'select',
        options: ['start', 'center', 'end', 'stretch', 'baseline'],
      },
    },
    justify: {
      defaultValue: '',
      control: {
        type: 'select',
        options: ['start', 'center', 'end', 'between'],
      },
    },
    wrap: {
      defaultValue: '',
      control: {
        type: 'select',
        options: ['wrap', 'noWrap', 'wrapReverse'],
      },
    },
    gap: {
      defaultValue: 2,
      control: {
        type: 'select',
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
    },
  },
} as ComponentMeta<typeof Flex>;

export const Default: ComponentStory<typeof Flex> = (props) => (
  <Box>
    <Flex {...props}>
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        1
      </Flex>
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        2
      </Flex>
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        3
      </Flex>
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        4
      </Flex>
    </Flex>
  </Box>
);
export const Directions: ComponentStory<typeof Flex> = (props) => (
  <Box>
    <Heading css={{ mb: '$4' }}>Row</Heading>
    <Flex {...props}>
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        1
      </Flex>
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        2
      </Flex>
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        3
      </Flex>
    </Flex>
    <Heading css={{ mb: '$4', mt: '$5' }}>Row Reverse</Heading>
    <Flex {...props} direction="rowReverse">
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        1
      </Flex>
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        2
      </Flex>
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        3
      </Flex>
    </Flex>
    <Heading css={{ mb: '$4', mt: '$5' }}>Column</Heading>
    <Flex {...props} direction="column">
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        1
      </Flex>
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        2
      </Flex>
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        3
      </Flex>
    </Flex>
    <Heading css={{ mb: '$4', mt: '$5' }}>Column Reverse</Heading>
    <Flex {...props} direction="columnReverse">
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        1
      </Flex>
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        2
      </Flex>
      <Flex
        css={{ backgroundColor: '$blue9', width: '$5', height: '$5' }}
        align="center"
        justify="center"
      >
        3
      </Flex>
    </Flex>
  </Box>
);

export const Alignmensts: ComponentStory<typeof Flex> = (props) => (
  <Box>
    <Heading size="2" css={{ mb: '$4' }}>
      Aligns
    </Heading>
    <Flex {...props}>
      <Box>
        <Heading css={{ mb: '$2' }}>start</Heading>

        <Flex
          css={{ backgroundColor: '$blue9', width: '200px', height: '200px' }}
          align="start"
          gap={2}
        >
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box
            css={{ backgroundColor: '$red10', width: '$5', height: '$5' }}
          />{' '}
        </Flex>
      </Box>
      <Box>
        <Heading css={{ mb: '$2' }}>center</Heading>
        <Flex
          css={{ backgroundColor: '$blue9', width: '200px', height: '200px' }}
          align="center"
          gap={2}
        >
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
        </Flex>
      </Box>{' '}
      <Box>
        <Heading css={{ mb: '$2' }}>end</Heading>
        <Flex
          css={{ backgroundColor: '$blue9', width: '200px', height: '200px' }}
          align="end"
          gap={2}
        >
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
        </Flex>
      </Box>{' '}
      <Box>
        <Heading css={{ mb: '$2' }}>stretch</Heading>
        <Flex
          css={{ backgroundColor: '$blue9', width: '200px', height: '200px' }}
          align="stretch"
          wrap="wrap"
          gap={2}
        >
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
        </Flex>
      </Box>{' '}
      <Box>
        <Heading css={{ mb: '$2' }}>baseline</Heading>
        <Flex
          css={{ backgroundColor: '$blue9', width: '200px', height: '200px' }}
          align="baseline"
          gap={2}
          wrap="wrap"
        >
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
        </Flex>
      </Box>
    </Flex>

    <Heading size="2" css={{ mb: '$4' }}>
      Justify
    </Heading>
    <Flex {...props}>
      <Box>
        <Heading css={{ mb: '$2' }}>start</Heading>

        <Flex
          css={{ backgroundColor: '$blue9', width: '200px', height: '200px' }}
          justify="start"
          gap={2}
        >
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box
            css={{ backgroundColor: '$red10', width: '$5', height: '$5' }}
          />{' '}
        </Flex>
      </Box>
      <Box>
        <Heading css={{ mb: '$2' }}>center</Heading>
        <Flex
          css={{ backgroundColor: '$blue9', width: '200px', height: '200px' }}
          justify="center"
          gap={2}
        >
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
        </Flex>
      </Box>{' '}
      <Box>
        <Heading css={{ mb: '$2' }}>end</Heading>
        <Flex
          css={{ backgroundColor: '$blue9', width: '200px', height: '200px' }}
          justify="end"
          gap={2}
        >
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
        </Flex>
      </Box>{' '}
    </Flex>

    <Heading size="2" css={{ mb: '$4' }}>
      Wrap
    </Heading>
    <Flex {...props}>
      <Box>
        <Heading css={{ mb: '$2' }}>wrap</Heading>

        <Flex
          css={{ backgroundColor: '$blue9', width: '200px', height: '200px' }}
          wrap="wrap"
          gap={2}
        >
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
        </Flex>
      </Box>
      <Box>
        <Heading css={{ mb: '$2' }}>noWrap</Heading>

        <Flex
          css={{ backgroundColor: '$blue9', width: '200px', height: '200px' }}
          wrap="noWrap"
          gap={2}
        >
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
        </Flex>
      </Box>
      <Box>
        <Heading css={{ mb: '$2' }}>wrapReverse</Heading>

        <Flex
          css={{ backgroundColor: '$blue9', width: '200px', height: '200px' }}
          wrap="wrapReverse"
          gap={2}
        >
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
          <Box css={{ backgroundColor: '$red10', width: '$5', height: '$5' }} />
        </Flex>
      </Box>
    </Flex>
  </Box>
);
