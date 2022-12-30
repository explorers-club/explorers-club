import { Box } from './Box';
import { Input } from './Input';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Label } from './Label';

export default {
  component: Input,
} as ComponentMeta<typeof Input>;

export const Default: ComponentStory<typeof Input> = (props) => (
  <Box>
    <Box css={{ mb: '$2' }}>
      <Label>Default</Label> <Input />
    </Box>
    <Box css={{ mb: '$2' }}>
      <Label>Range</Label> <Input type="range" />
    </Box>
    <Box css={{ mb: '$2' }}>
      <Label>Date</Label> <Input type="date" />
    </Box>
    <Box css={{ mb: '$2' }}>
      <Label>Date-with-time</Label> <Input type="datetime-local" />
    </Box>
  </Box>
);
