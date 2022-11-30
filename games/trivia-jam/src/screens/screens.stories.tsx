import {
  ActorType,
  createSharedCollectionMachine,
} from '@explorers-club/actor';
import { sleep } from '@explorers-club/utils';
import { Story } from '@storybook/react';
import { useInterpret } from '@xstate/react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import {
  SnapPointProps,
  defaultSnapProps,
} from 'react-spring-bottom-sheet/dist/types';
import {
  TriviaJamSharedContext,
  TriviaJamSharedServices,
  createTriviaJamSharedMachine,
  createTriviaJamPlayerMachine,
} from '../state';
import { GameContext } from '../state/game.context';
import { ScreensComponent } from './screens.component';

const DEFAULT_SNAP_POINTS = ({ footerHeight, maxHeight }: SnapPointProps) => [
  footerHeight + 24,
  maxHeight * 0.6,
  maxHeight * 0.9,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[1];

const triviaJamSharedMachine = createTriviaJamSharedMachine({
  services: {
    onHostPressStart: async () => {
      await sleep(1000);
    },
    onAllPlayersLoaded: async () => {
      await sleep(1000);
    },
  },
});

const sharedCollectionMachine = createSharedCollectionMachine({
  services: {},
  machines: {
    [ActorType.TRIVIA_JAM_PLAYER_ACTOR]: createTriviaJamPlayerMachine(),
    [ActorType.TRIVIA_JAM_SHARED_ACTOR]: triviaJamSharedMachine,
  },
});

const meta = {
  component: ScreensComponent,
  decorators: [
    (Story: Story) => {
      const triviaJamSharedActor = useInterpret(triviaJamSharedMachine);
      const sharedCollectionActor = useInterpret(sharedCollectionMachine);

      return (
        <GameContext.Provider
          value={{
            triviaJamSharedActor,
            sharedCollectionActor,
          }}
        >
          <BottomSheet
            open={true}
            blocking={false}
            defaultSnap={DEFAULT_SNAP}
            snapPoints={DEFAULT_SNAP_POINTS}
            expandOnContentDrag={true}
          >
            <Story />
          </BottomSheet>
        </GameContext.Provider>
      );
    },
  ],
};

type ScreenStory = Story<{
  context: TriviaJamSharedContext;
  services: Partial<TriviaJamSharedServices>;
}>;
const Template: ScreenStory = (args) => {
  const actor = useInterpret(machine.withContext(args.context));

  return <ScreensComponent actor={actor} />;
};

export const AsPlayer = Template.bind({});

AsPlayer.args = {
  context: {
    playerUserIds: ['foo', 'buz', 'bar'],
    hostUserIds: ['bar'],
    scores: {
      buz: 4,
      bar: 2,
    },
  },
};

export default meta;
