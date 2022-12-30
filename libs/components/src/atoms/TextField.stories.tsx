import { Box } from './Box';
import { TextField } from './TextField';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: TextField,
} as ComponentMeta<typeof TextField>;

export const Default: ComponentStory<typeof TextField> = (props) => (
  <Box>
    <TextField placeholder="Default TextField" />
  </Box>
);
export const Sizes: ComponentStory<typeof TextField> = (props) => (
  <Box>
    <TextField size="1" css={{ mb: '$2' }} placeholder="size 1" />
    <TextField size="2" css={{ mb: '$2' }} placeholder="size 2" />
    <TextField size="2" fullWidth css={{ mb: '$2' }} placeholder="Fullwidth" />
  </Box>
);
export const States: ComponentStory<typeof TextField> = (props) => (
  <Box>
    <TextField state="invalid" css={{ mb: '$2' }} placeholder="invalid state" />
    <TextField state="valid" css={{ mb: '$2' }} placeholder="Valid state" />
  </Box>
);
export const Using_Default_Cursor: ComponentStory<typeof TextField> = (
  props
) => (
  <Box>
    <TextField
      cursor="default"
      css={{ mb: '$2' }}
      placeholder="Cursor is default"
    />
    <TextField
      cursor="text"
      css={{ mb: '$2' }}
      placeholder="Cursor is changed for text"
    />
  </Box>
);
