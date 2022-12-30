import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Box } from './Box';
import { Heading } from './Heading';
import { ControlGroup } from './ControlGroup';
import { Button } from './Button';
import { TextField } from './TextField';
import { Select } from './Select';

export default {
  component: ControlGroup,
} as ComponentMeta<typeof ControlGroup>;

export const Default: ComponentStory<typeof ControlGroup> = (props) => (
  <Box>
    <Heading css={{ mb: '$5' }}>Buttons</Heading>
    <ControlGroup css={{ mb: '$2' }}>
      <Button>Button</Button>
      <Button>Button</Button>
      <Button>Button</Button>
      <Button>Button</Button>
    </ControlGroup>
    <Heading css={{ mb: '$5', mt: '$5' }}>TextFields</Heading>
    <ControlGroup css={{ mb: '$2' }}>
      <TextField />
      <TextField />
      <TextField />
    </ControlGroup>
    <Heading css={{ mb: '$5', mt: '$5' }}>Selects</Heading>
    <ControlGroup css={{ mb: '$2' }}>
      <Select key="$1">
        <option>option 1</option>
        <option>option 2</option>
        <option>option 3</option>
      </Select>
      <Select key="$1">
        <option>option 1</option>
        <option>option 2</option>
        <option>option 3</option>
      </Select>
    </ControlGroup>
  </Box>
);
export const Button_Groups: ComponentStory<typeof ControlGroup> = (props) => (
  <Box>
    <Heading css={{ mb: '$5' }}>Buttons</Heading>
    <ControlGroup css={{ mb: '$2' }}>
      <Button>Button</Button>
      <Button>Button</Button>
      <Button>Button</Button>
    </ControlGroup>
  </Box>
);

export const TextFields: ComponentStory<typeof ControlGroup> = (props) => (
  <Box>
    <ControlGroup css={{ mb: '$2' }}>
      <TextField />
      <TextField />

      <TextField />
    </ControlGroup>
    <ControlGroup css={{ mb: '$2' }}>
      <TextField />
    </ControlGroup>
  </Box>
);
export const Selects: ComponentStory<typeof ControlGroup> = (props) => (
  <Box>
    <ControlGroup css={{ mb: '$2' }}>
      <Select key="$1">
        <option>option 1</option>
        <option>option 2</option>
        <option>option 3</option>
      </Select>
      <Select key="$1">
        <option>option 1</option>
        <option>option 2</option>
        <option>option 3</option>
      </Select>
    </ControlGroup>
    <ControlGroup css={{ mb: '$2' }}>
      <Select key="$1">
        <option>option 1</option>
        <option>option 2</option>
        <option>option 3</option>
      </Select>
      <Select key="$1">
        <option>option 1</option>
        <option>option 2</option>
        <option>option 3</option>
        <option>option 1</option>
        <option>option 2</option>
        <option>option 3</option>
      </Select>
      <Select key="$1">
        <option>option 1</option>
        <option>option 2</option>
        <option>option 3</option>
      </Select>
    </ControlGroup>
  </Box>
);
export const Hybrid: ComponentStory<typeof ControlGroup> = (props) => (
  <Box>
    <ControlGroup css={{ mb: '$2' }}>
      <Button>Buttons and Selects</Button>
      <Select key="$1">
        <option>option 1</option>
        <option>option 2</option>
        <option>option 3</option>
      </Select>
    </ControlGroup>
    <ControlGroup css={{ mb: '$2' }}>
      <TextField placeholder="Textfield with Select" />
      <Select key="$1">
        <option>option 1</option>
        <option>option 2</option>
        <option>option 3</option>
      </Select>
    </ControlGroup>

    <ControlGroup css={{ mb: '$2' }}>
      <TextField placeholder="Textfield with Button" />
      <Button>Button</Button>
    </ControlGroup>
  </Box>
);
