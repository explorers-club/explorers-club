// Inspired by https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/button/stories/button.stories.tsx
import { ActorManager, ActorType, getActorId } from '@explorers-club/actor';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useInterpret } from '@xstate/react';
import { useMemo } from 'react';
import { createTriviaJamMachine } from '../state';
import { GameContext } from '../state/game.context';
import { Leaderboard } from './Leaderboard';

export default {
  component: Leaderboard,
  title: 'Components/Leaderboard',
  decorators: [
    (Story) => {
      const gameMachine = useMemo(() => {
        const actorId = getActorId(ActorType.TREEHOUSE_TRIVIA_ACTOR, 'partner');
        const actorManager = new ActorManager(actorId);
        const gameMachine = createTriviaJamMachine({ actorId, actorManager });
        return gameMachine;
      }, []);

      const gameActor = useInterpret(gameMachine);

      return (
        <GameContext.Provider value={{ gameActor }}>
          <Story />
        </GameContext.Provider>
      );
    },
  ],
} as ComponentMeta<typeof Leaderboard>;

export const main: ComponentStory<typeof Leaderboard> = (props) => (
  <Leaderboard />
);
