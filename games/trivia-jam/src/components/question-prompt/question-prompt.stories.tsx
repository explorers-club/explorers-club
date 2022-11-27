// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { ComponentMeta, ComponentStory, Story } from '@storybook/react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import {
  defaultSnapProps,
  SnapPointProps,
} from 'react-spring-bottom-sheet/dist/types';
import { QuestionPrompt } from './question-prompt.component';

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  footerHeight + 24,
  maxHeight * 0.6,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];

export default {
  component: QuestionPrompt,
  title: 'Components/Question Prompt',
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
} as ComponentMeta<typeof QuestionPrompt>;

export const SimpleExample: ComponentStory<typeof QuestionPrompt> = (args) => (
  <QuestionPrompt {...args} />
);

SimpleExample.args = {
  eyebrow: 'Round 1',
  question: 'How many ounces are in an gallon of milk?',
  inputLabel: 'Enter your guess',
};
