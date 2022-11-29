// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { ComponentMeta, ComponentStory, Story } from '@storybook/react';
import { useInterpret, useMachine } from '@xstate/react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import {
  defaultSnapProps,
  SnapPointProps,
} from 'react-spring-bottom-sheet/dist/types';
import { interpret } from 'xstate';
import { ScoreboardScreenComponent } from './scoreboard-screen.component';
import { ScoreboardPlayer } from './scoreboard-player.container';
import { createTriviaJamPlayerMachine } from '../../state/trivia-jam-player.machine';
import { useMemo } from '@storybook/addons';

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  footerHeight + 24,
  maxHeight * 0.6,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];

export default {
  component: ScoreboardScreenComponent,
  subcomponents: { ScoreboardPlayer },
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

const Template: Story<{
  players: { playerName: string; score: number }[];
}> = (args) => {
  const actors = useMemo(() => {
    const { players } = args;
    return players.map(({ playerName }) => {
      const machine = createTriviaJamPlayerMachine().withContext({
        playerName,
      });
      const actor = interpret(machine);
      actor.start();
      return actor;
    });
  }, [args]);

  return (
    <ScoreboardScreenComponent>
      {actors.map((actor, index) => (
        <ScoreboardPlayer actor={actor} score={args.players[index].score} />
      ))}
    </ScoreboardScreenComponent>
  );
};

export const OneItem = Template.bind({});

OneItem.args = {
  players: [
    {
      playerName: 'Foo',
      score: 2,
    },
  ],
};

export const TwoItems = Template.bind({});

TwoItems.args = {
  players: [
    {
      playerName: 'Bar',
      score: 3,
    },
    {
      playerName: 'Foo',
      score: 2,
    },
  ],
};
