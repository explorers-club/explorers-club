import { Meta } from '@storybook/react';
import { BigScreenLayout } from './big-screen-layout.component';

export default {
  component: BigScreenLayout,
  decorators: [
    (Story) => (
      // <Box css={{ height: '100vh' }}>
      <Story />
      // </Box>
    ),
  ],
} as Meta;

export const Default = {
  parameters: {
    layout: 'fullscreen',
  },
  args: { leftSheet: { open: false }, rightSheet: { open: false } },
};

export const RightOpen = {
  ...Default,
  args: {
    leftSheet: { open: false },
    rightSheet: { open: true, fullScreen: false },
  },
};

export const RightFullScreen = {
  ...Default,
  args: {
    leftSheet: { open: false },
    rightSheet: { open: true, fullScreen: true },
  },
};

export const LeftOpen = {
  ...Default,
  args: { leftSheet: { open: true }, rightSheet: { open: false } },
};

export const LeftFullScreen = {
  ...Default,
  args: {
    leftSheet: { open: true, fullScreen: true },
    rightSheet: { open: false },
  },
};
