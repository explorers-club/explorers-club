// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { useMemo } from '@storybook/addons';
import { ComponentMeta, Story } from '@storybook/react';
import { useInterpret } from '@xstate/react';
import { useContext } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import {
  defaultSnapProps,
  SnapPointProps
} from 'react-spring-bottom-sheet/dist/types';
import {
  TriviaJamServiceContext,
  TriviaJamServices
} from '../../state/services.context';
import { QuestionScreenComponent } from './question-screen.component';
import { createQuestionScreenMachine } from './question-screen.machine';

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  footerHeight + 24,
  maxHeight * 0.6,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];

const meta = {
  component: QuestionScreenComponent,
  parameters: {
    profiles: {
      values: [{ name: 'default', value: { userId: 'foo', name: 'bar' } }],
    },
  },
  decorators: [
    (Story, { parameters }) => {
      const mockServices = parameters['mockServices'];
      let serviceContextValues = {} as TriviaJamServiceContext;
      if (mockServices) {
        serviceContextValues = {
          ...serviceContextValues,
          ...mockServices,
        };
      }

      return (
        <TriviaJamServices.Provider value={serviceContextValues}>
          <BottomSheet
            open={true}
            blocking={false}
            defaultSnap={DEFAULT_SNAP}
            snapPoints={DEFAULT_SNAP_POINTS}
            expandOnContentDrag={true}
          >
            <Story />
          </BottomSheet>
        </TriviaJamServices.Provider>
      );
    },
  ],
} as ComponentMeta<typeof QuestionScreenComponent>;

export const Default: Story = () => {
  const services = useContext(TriviaJamServices);

  const questionScreenMachine = useMemo(
    () => createQuestionScreenMachine('foo'),
    []
  );
  const actor = useInterpret(questionScreenMachine, {
    services,
  });
  return <QuestionScreenComponent actor={actor} />;
};

export default meta;
