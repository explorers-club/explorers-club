import {
  IMultipleAnswer,
  IMultipleChoice,
  IMultipleChoiceFields,
  IMultipleAnswerFields,
  INumberInput,
  INumberInputFields,
  ITextInput,
  ITextInputFields,
  ITrueOrFalse,
  ITrueOrFalseFields,
} from '@explorers-club/contentful-types';
import {
  ActorRefFrom,
  assign,
  ContextFrom,
  createMachine,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { ModelEventsFrom } from 'xstate/lib/model.types';

export type IQuestion =
  | IMultipleChoice
  | IMultipleAnswer
  | INumberInput
  | ITextInput
  | ITrueOrFalse;

export type IQuestionFields =
  | IMultipleChoiceFields
  | IMultipleAnswerFields
  | INumberInputFields
  | ITextInputFields
  | ITrueOrFalseFields;

const triviaJamSharedModel = createModel(
  {
    playerUserIds: [] as string[],
    hostUserIds: [] as string[],
    scores: {} as Record<string, number>,
    questions: [] as IQuestion[],
    currentQuestionIndex: 0 as number,
  },
  {
    events: {
      ALL_PLAYERS_LOADED: () => ({}),
      HOST_PRESS_CONTINUE: () => ({}),
      SHOW_QUESTION_PROMPT_COMPLETE: () => ({}),
      RESPONSE_COMPLETE: () => ({}),
    },
  }
);

export type TriviaJamSharedContext = ContextFrom<typeof triviaJamSharedModel>;
export const TriviaJamSharedEvents = triviaJamSharedModel.events;

export type TriviaJamSharedAllPlayersLoadedEvent = ReturnType<
  typeof TriviaJamSharedEvents.ALL_PLAYERS_LOADED
>;
export type TriviaJamSharedHostPressContinueEvent = ReturnType<
  typeof TriviaJamSharedEvents.HOST_PRESS_CONTINUE
>;
export type TriviaJamSharedShowQuestionPromptCompleteEvent = ReturnType<
  typeof TriviaJamSharedEvents.SHOW_QUESTION_PROMPT_COMPLETE
>;
export type TriviaJamSharedResponseCompleteEvent = ReturnType<
  typeof TriviaJamSharedEvents.RESPONSE_COMPLETE
>;

/**
 * This is the interface the server must implement for
 * operating the services that the shared actor requires
 */
export type TriviaJamSharedServices = {
  loadNextQuestion: (context: TriviaJamSharedContext) => Promise<IQuestion>;

  onAllPlayersLoaded: (
    context: TriviaJamSharedContext
  ) => Promise<TriviaJamSharedAllPlayersLoadedEvent>;

  onHostPressContinue: (
    context: TriviaJamSharedContext
  ) => Promise<TriviaJamSharedHostPressContinueEvent>;

  onShowQuestionPromptComplete: (
    context: TriviaJamSharedContext
  ) => Promise<TriviaJamSharedShowQuestionPromptCompleteEvent>;

  onResponseComplete: (
    context: TriviaJamSharedContext
  ) => Promise<TriviaJamSharedResponseCompleteEvent>;
};

export type LoadNextQuestionDoneData = Awaited<
  ReturnType<TriviaJamSharedServices['loadNextQuestion']>
>;
export type LoadNextQuestionDoneEvent = {
  type: 'done.invoke.loadNextQuestion';
  data: LoadNextQuestionDoneData;
};

export type TriviaJamSharedEvent =
  | ModelEventsFrom<typeof triviaJamSharedModel>
  | LoadNextQuestionDoneEvent;

export const triviaJamSharedMachine = createMachine({
  id: 'TriviaJamShared',
  initial: 'Staging',
  schema: {
    context: {} as TriviaJamSharedContext,
    events: {} as TriviaJamSharedEvent,
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
          type: 'final' as const,
        },
      },
      onDone: 'Playing',
    },
    Playing: {
      initial: 'AwaitingQuestion',
      entry: assign({
        questions: [],
        currentQuestionIndex: -1,
      }),
      states: {
        AwaitingQuestion: {
          invoke: {
            id: 'onHostPressContinue',
            src: 'onHostPressContinue',
            onDone: 'OnQuestion',
          },
        },
        OnQuestion: {
          initial: 'Loading',
          entry: assign({
            currentQuestionIndex: ({ currentQuestionIndex }) =>
              currentQuestionIndex + 1,
          }),
          // onDone: [
          //   {
          //     target: 'AwaitingQuestion',
          //     cond: 'hasMoreQuestions',
          //   },
          //   {
          //     target: 'Complete',
          //   },
          // ],
          states: {
            Loading: {
              invoke: {
                id: 'loadNextQuestion',
                src: 'loadNextQuestion',
                onDone: {
                  target: 'Presenting',
                  actions: assign<
                    TriviaJamSharedContext,
                    LoadNextQuestionDoneEvent
                  >({
                    questions: ({ questions }, event) => [
                      ...questions,
                      event.data,
                    ],
                  }),
                },
              },
            },
            Presenting: {
              // invoke: {
              //   id: 'onShowQuestionPromptComplete',
              //   src: 'onShowQuestionPromptComplete',
              //   onDone: 'Responding',
              // },
            },
            // Responding: {
            //   invoke: {
            //     id: 'onResponseComplete',
            //     src: 'onResponseComplete',
            //     onDone: 'Reviewing',
            //   },
            // },
            // Reviewing: {
            //   invoke: {
            //     id: 'onHostPressContinue',
            //     src: 'onHostPressContinue',
            //     onDone: 'Complete',
            //   },
            // },
            // Complete: {
            //   type: 'final' as const,
            // },
          },
        },
      },
    },
  },
});
// AwaitingQuestion: {
//   type: 'parallel',
//   states: {
//     WaitingForHost: {
//       invoke: {
//         id: 'onHostPressContinue',
//         src: 'onHostPressContinue',
//       },
//     },
//     NextQuestion: {
//       invoke: {
//         id: 'fetchNextQuestion',
//         src: 'fetchNextQuestion',
//         onDone: {
//           target: 'Success',
//           actions: assign<
//             TriviaJamSharedContext,
//             FetchNextQuestionDoneEvent
//           >({
//             // questions: ({ questions }, event) => {
//             //   const question = event.data;
//             //   return
//             //      [
//             //       ...questions,
//             //       question
//             //     ]
//             // },
//           }),
//         },
//       },
//     },
//   },
// },
// OnQuestion: {
//   initial: 'Presenting',
//   onDone: [
//     {
//       target: 'AwaitingQuestion',
//       cond: 'hasMoreQuestions',
//     },
//     {
//       target: 'Complete',
//     },
//   ],
//   states: {
//     Presenting: {
//       invoke: {
//         id: 'showQuestionPromptComplete$',
//         src: 'showQuestionPromptComplete$',
//         onDone: 'Responding',
//       },
//     },
//     Responding: {
//       invoke: {
//         id: 'responseComplete$',
//         src: 'responseComplete$',
//         onDone: 'Reviewing',
//       },
//     },
//     Reviewing: {
//       invoke: {
//         id: 'onHostPressContinue',
//         src: 'onHostPressContinue',
//         onDone: 'Complete',
//       },
//     },
//     Complete: {
//       type: 'final' as const,
//     },
//   },
// },
// Complete: {
//   type: 'final' as const,
// },
// },
// GameOver: {
//   type: 'final' as const,
// },

export type TriviaJamSharedMachine = typeof triviaJamSharedMachine;
export type TriviaJamSharedActor = ActorRefFrom<TriviaJamSharedMachine>;
export type TriviaJamSharedState = StateFrom<TriviaJamSharedMachine>;
