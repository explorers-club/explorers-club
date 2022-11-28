import { ActorRefFrom, createMachine, StateFrom } from 'xstate';

interface ScoreboardScreenContext {
  scoresByUserId: Record<string, number>;
}

export const createScoreboardScreenMachine = () => {
  return createMachine({
    id: 'ScoreboardScreenMachine',
    schema: {
      context: {} as ScoreboardScreenContext,
    },
    initial: 'Idle',
    states: {
      Idle: {},
    },
  });
};

type ScoreboardScreenMachine = ReturnType<typeof createScoreboardScreenMachine>;
export type ScoreboardScreenActor = ActorRefFrom<ScoreboardScreenMachine>;
export type ScoreboardScreenState = StateFrom<ScoreboardScreenMachine>;
