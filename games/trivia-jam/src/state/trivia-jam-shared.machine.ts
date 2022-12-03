import { Observable } from 'rxjs';
import { ActorRefFrom, ContextFrom, createMachine, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const triviaJamSharedModel = createModel(
  {
    playerUserIds: [] as string[],
    hostUserIds: [] as string[],
    scores: {} as Record<string, number>,
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
  onAllPlayersLoaded: (
    context: TriviaJamSharedContext
  ) => Promise<TriviaJamSharedAllPlayersLoadedEvent>;

  onHostPressContinue: (
    context: TriviaJamSharedContext
  ) => Promise<TriviaJamSharedHostPressContinueEvent>;

  showQuestionPromptComplete$: (
    context: TriviaJamSharedContext
  ) => Observable<TriviaJamSharedShowQuestionPromptCompleteEvent>;

  responseComplete$: (
    context: TriviaJamSharedContext
  ) => Observable<TriviaJamSharedResponseCompleteEvent>;
};

export const triviaJamSharedMachine = createMachine(
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
          },
          OnQuestion: {
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
                  id: 'showQuestionPromptComplete$',
                  src: 'showQuestionPromptComplete$',
                  onDone: 'Responding',
                },
              },
              Responding: {
                invoke: {
                  id: 'responseComplete$',
                  src: 'responseComplete$',
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
  }
);

export type TriviaJamSharedMachine = typeof triviaJamSharedMachine;
export type TriviaJamSharedActor = ActorRefFrom<TriviaJamSharedMachine>;
export type TriviaJamSharedState = StateFrom<TriviaJamSharedMachine>;
