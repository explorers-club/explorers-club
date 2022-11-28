// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useInterpret, useMachine } from '@xstate/react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import {
  defaultSnapProps,
  SnapPointProps,
} from 'react-spring-bottom-sheet/dist/types';
import { interpret } from 'xstate';
import { ScoreboardScreenComponent } from './scoreboard-screen.component';
import { createScoreboardScreenMachine } from './scoreboard-screen.machine';

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  footerHeight + 24,
  maxHeight * 0.6,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];

export default {
  component: ScoreboardScreenComponent,
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
} as ComponentMeta<typeof ScoreboardScreenComponent>;

const machine = createScoreboardScreenMachine();

export const Default: ComponentStory<typeof ScoreboardScreenComponent> = (
  args
) => {
  const actor = useInterpret(machine, {
    context: {
      scoresByUserId: {
        foo: 3,
        bar: 4,
        buz: 5,
        bat: 6,
        fuz: 7,
      },
    },
  });
  return <ScoreboardScreenComponent actor={actor} />;
};

// Default.args = {
//   //   actor,
// };

Default.parameters = {
  xstate: true,
};
