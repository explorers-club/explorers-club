import { assertEventType } from '@explorers-club/actor';
import { Observable } from 'rxjs';
import {
  ActorRefFrom,
  assign,
  ContextFrom,
  createMachine,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { ModelEventsFrom } from 'xstate/lib/model.types';
import { QuestionData } from './types';

const triviaJamSharedModel = createModel(
  {
    playerUserIds: [] as string[],
    hostUserIds: [] as string[],
    scores: {} as Record<string, number>,
    questions: [] as QuestionData[],
    currentQuestion: 0 as number,
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
  fetchNextQuestion: (context: TriviaJamSharedContext) => Promise<QuestionData>;

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

export type FetchNextQuestionDoneData = Awaited<
  ReturnType<TriviaJamSharedServices['fetchNextQuestion']>
>;
export type FetchNextQuestionDoneEvent = {
  type: 'done.invoke.fetchNextQuestion';
  data: FetchNextQuestionDoneData;
};

export type TriviaJamSharedEvent =
  | ModelEventsFrom<typeof triviaJamSharedModel>
  | FetchNextQuestionDoneEvent;

export const triviaJamSharedMachine = createMachine(
  {
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
        states: {
          AwaitingQuestion: {
            invoke: {
              id: 'onHostPressContinue',
              src: 'onHostPressContinue',
              onDone: 'OnQuestion',
            },
            // initial: 'NextQuestion',
            // onDone: 'OnQuestion',
            // states: {
            //   NextQuestion: {
            //     initial: 'Fetching',
            //     states: {
            //       Fetching: {
            //         invoke: {
            //           id: 'fetchNextQuestion',
            //           src: 'fetchNextQuestion',
            //           onDone: { actions: 'pushQuestion' },
            //         },
            //       },
            //       Ready: {
            //         invoke: {
            //           id: 'onHostPressContinue',
            //           src: 'onHostPressContinue',
            //           onDone: 'GoingToNext',
            //         },
            //       },
            //       GoingToNext: {
            //         type: 'final' as const,
            //       },
            //     },
            //   },
            // },
          },
          OnQuestion: {
            initial: 'Presenting',
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
  },
  {
    actions: {
      pushQuestion: assign<TriviaJamSharedContext, FetchNextQuestionDoneEvent>({
        questions: ({ questions }, event) => [...questions, event.data],
      }),
    },
  }
);
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
