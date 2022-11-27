// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Leaderboard } from './leaderboard.component';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { SnapPointProps, defaultSnapProps } from 'react-spring-bottom-sheet/dist/types';

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
      // const gameMachine = useMemo(() => {
      //   const actorId = getActorId(
      //     ActorType.TRIVIA_JAM_PLAYER_ACTOR,
      //     'partner'
      //   );
      //   const actorManager = new ActorManager(actorId);
      //   const gameMachine = createTriviaJamMachine({ actorId, actorManager });
      //   return gameMachine;
      // }, []);

      // const gameActor = useInterpret(gameMachine);

      return (
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
      );
    },
  ],
} as ComponentMeta<typeof Leaderboard>;

export const main: ComponentStory<typeof Leaderboard> = (props) => (
  <Leaderboard />
);
