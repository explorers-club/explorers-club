import { ActorRefFrom, ContextFrom, createMachine, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const triviaJamSharedModel = createModel({
  playerUserIds: [] as string[],
  hostUserId: '' as string,
  scores: {} as Record<string, number>,
});

export type TriviaJamSharedContext = ContextFrom<typeof triviaJamSharedModel>;

export const triviaJamSharedMachine = createMachine({
  id: 'TriviaJamShared',
  initial: 'Loading',
  schema: {
    context: {} as TriviaJamSharedContext,
  },
  states: {
    Loading: {
      invoke: {
        src: 'onAllPlayersLoaded',
        onDone: {
          target: 'Playing',
        },
      },
    },
    Playing: {
      states: {
        AwaitingQuestion: {
          invoke: {
            src: 'onHostPressNextQuestion',
          },
        },
        Question: {
          initial: 'Presenting',
          onDone: 'AwaitingQuestion',
          states: {
            Presenting: {
              invoke: {
                src: 'onEnableResponding',
                onDone: 'Responding',
              },
            },
            Responding: {
              invoke: {
                src: 'onResponse',
                onDone: {
                  target: 'Responding',
                  cond: 'isCorrectResponse',
                },
              },
            },
            Reviewing: {
              type: 'final' as const,
            },
          },
        },
      },
    },
    GameOver: {
      type: 'final' as const,
    },
  },
  predictableActionArguments: true,
});

export type TriviaJamSharedMachine = typeof triviaJamSharedMachine;
export type TriviaJamSharedActor = ActorRefFrom<TriviaJamSharedMachine>;
export type TriviaJamSharedState = StateFrom<TriviaJamSharedMachine>;
