import { Box } from './Box';
import { Overlay } from './Overlay';
import { Text } from './Text';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Overlay,
} as ComponentMeta<typeof Overlay>;

export const Default: ComponentStory<typeof Overlay> = (props) => (
  <Box>
    <Overlay css={{ p: '$3' }}>
      <Text>This is an example of overlay</Text>
    </Overlay>
  </Box>
);
