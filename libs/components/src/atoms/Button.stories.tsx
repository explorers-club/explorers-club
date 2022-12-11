// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Button } from './Button';

export default {
  component: Button,
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
    fullWidth: {
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    ghost: {
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    size: {
      defaultValue: false,
      control: {
        type: 'select',
        options: [1, 2, 3],
      },
    },
    color: {
      options: ['gray', 'green', 'blue'],
    },
  },
} as ComponentMeta<typeof Button>;

export const Primary: ComponentStory<typeof Button> = (props) => (
  <Button {...props}>Button</Button>
);
