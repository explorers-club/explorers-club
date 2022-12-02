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

export type TriviaJamSharedServices = {
  onAllPlayersLoaded: (
    context: TriviaJamSharedContext
  ) => Observable<TriviaJamSharedAllPlayersLoadedEvent>;

  onHostPressContinue: (
    context: TriviaJamSharedContext
  ) => Observable<TriviaJamSharedHostPressContinueEvent>;

  onShowQuestionPromptComplete: (
    context: TriviaJamSharedContext
  ) => Observable<TriviaJamSharedShowQuestionPromptCompleteEvent>;

  onResponseComplete: (
    context: TriviaJamSharedContext
  ) => Observable<TriviaJamSharedResponseCompleteEvent>;
};

interface CreateProps {
  services: TriviaJamSharedServices;
}

export const createTriviaJamSharedMachine = ({
  services: {
    onAllPlayersLoaded,
    onHostPressContinue,
    onShowQuestionPromptComplete,
    onResponseComplete,
  },
}: CreateProps) =>
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
                src: onAllPlayersLoaded,
                onDone: 'AllLoaded',
              },
            },
            AllLoaded: {
              invoke: {
                id: 'onHostPressContinue',
                src: onHostPressContinue,
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
                src: onHostPressContinue,
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
                    id: 'onShowQuestionPromptComplete',
                    src: onShowQuestionPromptComplete,
                    onDone: 'Responding',
                  },
                },
                Responding: {
                  invoke: {
                    id: 'onResponseComplete',
                    src: onResponseComplete,
                    onDone: 'Reviewing',
                  },
                },
                Reviewing: {
                  invoke: {
                    id: 'onHostPressContinue',
                    src: onHostPressContinue,
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

const allPlayersLoaded$ =
  new Observable<TriviaJamSharedAllPlayersLoadedEvent>();
const hostPressContinue$ =
  new Observable<TriviaJamSharedHostPressContinueEvent>();
const showQuestionPromptComplete$ =
  new Observable<TriviaJamSharedShowQuestionPromptCompleteEvent>();
const responseComplete$ =
  new Observable<TriviaJamSharedResponseCompleteEvent>();

export const triviaJamSharedServices: TriviaJamSharedServices = {
  onAllPlayersLoaded: () => allPlayersLoaded$,
  onHostPressContinue: () => hostPressContinue$,
  onShowQuestionPromptComplete: () => showQuestionPromptComplete$,
  onResponseComplete: () => responseComplete$,
};

export type TriviaJamSharedMachine = ReturnType<
  typeof createTriviaJamSharedMachine
>;
export type TriviaJamSharedActor = ActorRefFrom<TriviaJamSharedMachine>;
export type TriviaJamSharedState = StateFrom<TriviaJamSharedMachine>;
