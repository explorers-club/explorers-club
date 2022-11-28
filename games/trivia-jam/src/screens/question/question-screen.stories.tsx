// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { useMemo } from '@storybook/addons';
import { ComponentMeta, ComponentStory, Meta, Story } from '@storybook/react';
import { useInterpret, useMachine } from '@xstate/react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import {
  defaultSnapProps,
  SnapPointProps,
} from 'react-spring-bottom-sheet/dist/types';
import { createMachine, interpret } from 'xstate';
import { QuestionData } from '../../state/types';
import { QuestionScreenComponent } from './question-screen.component';
import { createQuestionScreenMachine } from './question-screen.machine';

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  footerHeight + 24,
  maxHeight * 0.6,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];

export default {
  component: QuestionScreenComponent,
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
} as ComponentMeta<typeof QuestionScreenComponent>;

export const Default: Story = () => {
  const questionScreenMachine = useMemo(
    () => createQuestionScreenMachine('foo'),
    []
  );
  const actor = useInterpret(questionScreenMachine, {
    services: {
      fetchQuestion: createMockFetchMachine<QuestionData>({
        id: 'foo',
        type: 'ClosestValue',
        question: 'How many ounces are in a gallon of milk',
        answer: 128,
      }),
    },
  });
  return <QuestionScreenComponent actor={actor} />;
};

function createMockFetchMachine<T>(data: T) {
  return createMachine({
    id: 'FakeFetchMachine',
    initial: 'Loading',
    schema: {
      context: {} as { url: string; data: T },
    },
    states: {
      Loading: {
        invoke: {
          src: async () => data,
          onDone: 'Success',
        },
      },
      Success: {
        type: 'final' as const,
      },
    },
  });
}

// const actor = createIntroduc
const machine = createQuestionScreenMachine('foo');
const actor = interpret(machine);

Default.args = {
  actor,
};

actor.start(); // todo how to handle hot reload

Default.parameters = {
  xstate: true,
};
