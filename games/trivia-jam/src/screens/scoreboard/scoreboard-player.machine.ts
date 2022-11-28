import { createMachine, ActorRefFrom, StateFrom } from 'xstate';

interface ScoreboardPlayerContext {
  userId: string;
  score: number;
  name?: string;
}

export const scoreboardPlayerMachine = createMachine({
  id: 'ScoreboardPlayer',
  initial: 'Loading',
  schema: {
    context: {} as ScoreboardPlayerContext,
  },
  states: {
    Loading: {
      invoke: {
        src: 'fetchProfile',
        data: {
          userId: ({ userId }: ScoreboardPlayerContext) => userId,
        },
      },
    },
  },
});

type ScoreboardPlayerMachine = typeof scoreboardPlayerMachine;
export type ScoreboardPlayerActor = ActorRefFrom<ScoreboardPlayerMachine>;
export type ScoreboardPlayerState = StateFrom<ScoreboardPlayerMachine>;
