// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { createIntroductionScreenMachine } from './introduction-screen.machine';
import 'react-spring-bottom-sheet/dist/style.css';
import {
  defaultSnapProps,
  SnapPointProps,
} from 'react-spring-bottom-sheet/dist/types';
import { createMachine, interpret } from 'xstate';
import { IntroductionScreenComponent } from './introduction-screen.component';

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  footerHeight + 24,
  maxHeight * 0.6,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];

export default {
  component: IntroductionScreenComponent,
  title: 'Screens/Introduction',
  decorators: [
    (Story) => {
      return (
        <BottomSheet
          open={true}
          blocking={false}
          defaultSnap={DEFAULT_SNAP}
          snapPoints={DEFAULT_SNAP_POINTS}
          expandOnContentDrag={true}
        >
          <Story />
        </BottomSheet>
      );
    },
  ],
} as ComponentMeta<typeof IntroductionScreenComponent>;

export const Default: ComponentStory<typeof IntroductionScreenComponent> = (
  args
) => <IntroductionScreenComponent {...args} />;

// const actor = createIntroduc
const machine = createIntroductionScreenMachine();
const actor = interpret(machine);

Default.args = {
  title: 'Example title',
  actor,
};

actor.start(); // todo how to handle hot reload

Default.parameters = {
  xstate: true,
};
