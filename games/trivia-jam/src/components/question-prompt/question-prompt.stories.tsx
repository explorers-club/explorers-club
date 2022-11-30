// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
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
  decorators: [
    (Story) => {
      return (
        // <BottomSheet
        //   open={true}
        //   blocking={false}
        //   defaultSnap={DEFAULT_SNAP}
        //   snapPoints={DEFAULT_SNAP_POINTS}
        //   expandOnContentDrag={true}
        // >
        <Story />
        // </BottomSheet>
      );
    },
  ],
} as ComponentMeta<typeof QuestionPrompt>;

const Template: ComponentStory<typeof QuestionPrompt> = (args) => (
  <QuestionPrompt {...args} />
);

export const Default = Template.bind({});

Default.args = {
  eyebrow: 'Round 1',
  question: 'How many ounces are in an gallon of milk?',
  inputLabel: 'Enter your guess',
};

export const FilledForm = Template.bind({});
FilledForm.play = async (props) => {
  const canvas = within(props.canvasElement);
  console.log(props, canvas);
  await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');
};

FilledForm.args = {
  eyebrow: 'Round 1',
  question: 'How many ounces are in an gallon of milk?',
  inputLabel: 'Enter your guess',
};
