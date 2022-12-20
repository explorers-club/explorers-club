import { Box } from './Box';
import { Text } from './Text';
import { Image } from './Image';
import { Avatar } from './Avatar';

export default {
  component: Box,
};

export const Default = {
  render: () => (
    <Box css={{ backgroundColor: 'cyan' }}>
      <Text>Default Box</Text>
      <Text>
        This is a Box. Use it anywhere you can use where typically would want a
        div/view. Boxes are non-interactive.
      </Text>
    </Box>
  ),
};
