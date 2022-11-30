import { ActorRefFrom, ContextFrom, createMachine, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const triviaJamSharedModel = createModel({
  playerUserIds: [] as string[],
  hostUserIds: [] as string[],
  scores: {} as Record<string, number>,
});

export type TriviaJamSharedContext = ContextFrom<typeof triviaJamSharedModel>;
export const TriviaJamSharedEvents = triviaJamSharedModel.events;

export type TriviaJamSharedServices = {
  onAllPlayersLoaded: () => Promise<void>;
  onHostPressStart: () => Promise<void>;
  onHostPressContinue: () => Promise<void>;
  onShowQuestionPromptComplete: () => Promise<void>;
  onResponseComplete: () => Promise<void>;
};

export const createTriviaJamSharedMachine = (props: {
  services: Partial<TriviaJamSharedServices>;
}) =>
  createMachine(
    {
      id: 'TriviaJamShared',
      initial: 'Staging',
      schema: {
        context: {} as TriviaJamSharedContext,
      },
      states: {
        Staging: {
          initial: 'Loading',
          states: {
            Loading: {
              invoke: {
                id: 'onAllPlayersLoaded',
                src: 'onAllPlayersLoaded',
                onDone: 'AllLoaded',
              },
            },
            AllLoaded: {
              invoke: {
                id: 'onHostPressStart',
                src: 'onHostPressStart',
              },
              type: 'final' as const,
            },
          },
          onDone: 'Playing',
        },
        Playing: {
          initial: 'AwaitingQuestion',
          states: {
            AwaitingQuestion: {
              invoke: {
                id: 'onHostPressContinue',
                src: 'onHostPressContinue',
                onDone: 'Question',
              },
            },
            Question: {
              initial: 'Presenting',
              onDone: [
                {
                  target: 'AwaitingQuestion',
                  cond: 'hasMoreQuestions',
                },
                {
                  target: 'Complete',
                },
              ],
              states: {
                Presenting: {
                  invoke: {
                    id: 'onShowQuestionPromptComplete',
                    src: 'onShowQuestionPromptComplete',
                    onDone: 'Responding',
                  },
                },
                Responding: {
                  invoke: {
                    id: 'onResponseComplete',
                    src: 'onResponseComplete',
                    onDone: 'Reviewing',
                  },
                },
                Reviewing: {
                  invoke: {
                    id: 'onHostPressContinue',
                    src: 'onHostPressContinue',
                    onDone: 'Complete',
                  },
                },
                Complete: {
                  type: 'final' as const,
                },
              },
            },
            Complete: {
              type: 'final' as const,
            },
          },
          onDone: 'GameOver',
        },
        GameOver: {
          type: 'final' as const,
        },
      },
      predictableActionArguments: true,
    },
    {
      guards: {
        hasMoreQuestions: () => {
          // todo logic based off question set
          return true;
        },
      },
      services: props.services,
    }
  );

export type TriviaJamSharedMachine = ReturnType<
  typeof createTriviaJamSharedMachine
>;
export type TriviaJamSharedActor = ActorRefFrom<TriviaJamSharedMachine>;
export type TriviaJamSharedState = StateFrom<TriviaJamSharedMachine>;
