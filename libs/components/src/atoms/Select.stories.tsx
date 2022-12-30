import { Flex } from './Flex';
import { Select } from './Select';
import { Box } from './Box';
import { Text } from './Text';
import { Avatar } from './Avatar';
import { Image } from './Image';
import { Heading } from './Heading';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Label } from './Label';

export default {
  component: Select,
} as ComponentMeta<typeof Select>;

export const Default: ComponentStory<typeof Select> = (props) => (
  <Box>
    <Label css={{ mb: '$2' }}>Default Select</Label>
    <Select>
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
      <option>Option 4</option>
      <option>Option 5</option>
    </Select>
  </Box>
);
