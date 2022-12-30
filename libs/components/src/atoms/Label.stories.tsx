import { Box } from './Box';
import { Label } from './Label';
import { Input } from './Input';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Label,
} as ComponentMeta<typeof Label>;

export const Default: ComponentStory<typeof Label> = (props) => (
  <Box as="form">
    <Label>Normal Label</Label>
    <br />
    <Input />
  </Box>
);
