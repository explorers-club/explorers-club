import { createMachine } from 'xstate';

export interface TriviaJamPlayerContext {
  playerName: string;
}

export type TriviaJamPlayerEvent = { type: 'JOIN' };

export const createTriviaJamPlayerMachine = () =>
  createMachine(
    {
      id: 'TriviaJamPlayer',
      schema: {
        context: {} as TriviaJamPlayerContext,
        events: {} as TriviaJamPlayerEvent,
      },
      initial: 'Playing',
      states: {
        Playing: {
          // future handle disocnnect / reconnect logic here
        },
      },
      predictableActionArguments: true,
    },
    {}
  );

export type TriviaJamPlayerMachine = ReturnType<
  typeof createTriviaJamPlayerMachine
>;
