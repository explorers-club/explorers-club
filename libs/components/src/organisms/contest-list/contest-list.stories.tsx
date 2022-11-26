// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ContestList } from './contest-list.component';

export default {
  component: ContestList,
  title: 'Organisms/Contest List',
  // argTypes: {
  //   as: {
  //     control: {
  //       type: null,
  //     },
  //   },
  //   ref: {
  //     control: {
  //       type: null,
  //     },
  //   },
  //   fullWidth: {
  //     defaultValue: false,
  //     control: {
  //       type: 'boolean',
  //     },
  //   },
  //   ghost: {
  //     defaultValue: false,
  //     control: {
  //       type: 'boolean',
  //     },
  //   },
  //   size: {
  //     defaultValue: false,
  //     control: {
  //       type: 'select',
  //       options: [1, 2, 3],
  //     },
  //   },
  //   color: {
  //     options: ['gray', 'green', 'blue'],
  //   },
  // },
} as ComponentMeta<typeof ContestList>;

export const Loading: ComponentStory<typeof ContestList> = (props) => (
  <ContestList />
);

export const Empty: ComponentStory<typeof ContestList> = (props) => (
  <ContestList />
);

export const Single: ComponentStory<typeof ContestList> = (props) => (
  <ContestList />
);

export const Multiple: ComponentStory<typeof ContestList> = (props) => (
  <ContestList />
);
