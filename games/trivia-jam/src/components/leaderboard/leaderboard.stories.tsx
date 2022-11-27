// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useInterpret } from '@xstate/react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import {
  defaultSnapProps,
  SnapPointProps
} from 'react-spring-bottom-sheet/dist/types';
import { triviaJamSharedMachine } from '../../state';
import { GameContext } from '../../state/game.context';
import { Leaderboard } from './leaderboard.component';

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  footerHeight + 24,
  maxHeight * 0.6,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];

export default {
  component: Leaderboard,
  title: 'Components/Leaderboard',
  decorators: [
    (Story) => {
      // How can I grab story props from here?

      const sharedGameService = useInterpret(triviaJamSharedMachine, {
        context: {
          playerUserIds: ['foo', 'bar', 'buz', 'bat', 'fuz'],
          hostUserId: 'buzz',
          scores: {
            foo: 0,
            bar: 0,
            buz: 0,
            bat: 0,
            fuz: 0,
          },
        },
      });

      return (
        <GameContext.Provider value={{ sharedGameService }}>
          <BottomSheet
            open={true}
            blocking={false}
            defaultSnap={DEFAULT_SNAP}
            snapPoints={DEFAULT_SNAP_POINTS}
            expandOnContentDrag={true}
            // snapPoints={({ minHeight }) => [minHeight + 24]}
            // footer={FooterComponent}
            // header={header}
          >
            <Story />
          </BottomSheet>
        </GameContext.Provider>
      );
    },
  ],
} as ComponentMeta<typeof Leaderboard>;

export const main: ComponentStory<typeof Leaderboard> = (props) => (
  <Leaderboard />
);
