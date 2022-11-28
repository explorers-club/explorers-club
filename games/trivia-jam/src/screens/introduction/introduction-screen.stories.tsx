// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { createMockFetchMachine } from '../../../.storybook/service-mocks';
import { ComponentMeta, Story } from '@storybook/react';
import { useInterpret } from '@xstate/react';
import { useMemo } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import {
  defaultSnapProps,
  SnapPointProps,
} from 'react-spring-bottom-sheet/dist/types';
import { QuestionData } from '../../state/types';
import { IntroductionScreenComponent } from './introduction-screen.component';
import { createIntroductionScreenMachine } from './introduction-screen.machine';

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  footerHeight + 24,
  maxHeight * 0.6,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];

const meta = {
  component: IntroductionScreenComponent,
  decorators: [
    (Story, props) => {
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

export const Default: Story = (args) => {
  console.log('story', args);
  const questionScreenMachine = useMemo(
    () => createIntroductionScreenMachine(),
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
  return <IntroductionScreenComponent actor={actor} />;
};

Default.parameters = {
  xstate: true,
};

export default meta;
