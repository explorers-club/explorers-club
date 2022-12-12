import { assertEventType, unwrapEvent } from '@explorers-club/actor';
import { from } from 'rxjs';
import {
  actions,
  ActorRefFrom,
  ContextFrom,
  createMachine,
  DoneInvokeEvent,
  EventFrom,
  StateFrom,
} from 'xstate';
import { assign } from 'xstate/lib/actions';
import { createModel } from 'xstate/lib/model';
import { getPrediction } from '../lib/replicate';
import { DiffusionaryPlayerEnterPromptEvent } from './diffusionary-player.machine';

const diffusionarySharedModel = createModel({
  playerUserIds: [] as string[],
  scoresByUserId: {} as Record<string, number>,
  currentPlayer: undefined as string | undefined,
  currentRound: 1 as number,
  currentPrompt: undefined as string | undefined,
  currentPredictionId: undefined as string | undefined,
  currentImage: undefined as string | undefined,
});

export const DiffusionarySharedEvents = diffusionarySharedModel.events;
export type DiffusionarySharedContext = ContextFrom<
  typeof diffusionarySharedModel
>;
export type DiffusionarySharedEvent = EventFrom<typeof diffusionarySharedModel>;

// createServiceModel({
//   onAllPlayersLoaded
// })

export type DiffusionarySharedServices = {
  onAllPlayersReady: (
    context: DiffusionarySharedContext
  ) => Promise<{ type: 'ALL_PLAYERS_READY' }>;
  onPlayerEnterPrompt: (
    context: DiffusionarySharedContext
  ) => Promise<DiffusionaryPlayerEnterPromptEvent>;
  startDiffusion: (context: DiffusionarySharedContext) => Promise<string>;
};

export const diffusionarySharedMachine = createMachine(
  {
    id: 'DiffusionarySharedMachine',
    initial: 'Loading',
    schema: {
      context: {} as DiffusionarySharedContext,
    },
    states: {
      Loading: {
        invoke: {
          id: 'onAllPlayersReady',
          src: 'onAllPlayersReady',
          onDone: 'Playing',
        },
      },
      Playing: {
        initial: 'EnteringPrompt',
        states: {
          EnteringPrompt: {
            invoke: {
              id: 'onPlayerEnterPrompt',
              src: 'onPlayerEnterPrompt',
              onDone: {
                target: 'StartingDiffusion',
                actions: assign<
                  DiffusionarySharedContext,
                  DoneInvokeEvent<DiffusionaryPlayerEnterPromptEvent>
                >({
                  currentPrompt: (_, event) => event.data.prompt,
                }),
              },
            },
          },
          StartingDiffusion: {
            invoke: {
              id: 'startDiffusion',
              src: 'startDiffusion',
              onDone: {
                target: 'Guessing',
                actions: assign<
                  DiffusionarySharedContext,
                  DoneInvokeEvent<string>
                >({
                  currentPredictionId: (_, event) => event.data,
                }),
              },
            },
          },
          Guessing: {
            type: 'parallel',
            states: {
              DiffusionStatus: {
                initial: 'Loading',
                states: {
                  Loading: {
                    invoke: {
                      src: async ({ currentPredictionId }) => {
                        if (!currentPredictionId) {
                          throw new Error(
                            'tried to get prediction without current prediction id set'
                          );
                        }
                        const prediction = await getPrediction(
                          currentPredictionId
                        );
                        const json = await prediction.json();
                        return json;
                      },
                      onDone: [
                        {
                          target: 'Waiting',
                          cond: (_, event) => event.data.status !== 'succeeded',
                        },
                        {
                          target: 'Done',
                          actions: assign({
                            currentImageUrl: (_, event) => {
                              // TODO make safe
                              return event.data.output[0];
                            },
                          }),
                        },
                      ],
                    },
                  },
                  Waiting: {
                    after: {
                      5000: 'Loading',
                    },
                  },
                  Done: {
                    type: 'final' as const,
                  },
                },
              },
              WaitingForResponses: {
                invoke: {
                  id: 'onPlayerSubmitResponse',
                  src: 'onPlayerSubmitResponse',
                  // onDone: [
                  //   { cond: 'isGameOver', target: 'GameOver' },
                  //   {
                  //     target: 'EnteringPrompt',
                  //   },
                  // ],
                },
              },
              // Responses: {
              //   invoke: {
              //     id: 'onPlayerSubmitResponse',
              //     src: 'onPlayerSubmitResponse',
              //     // onDone: [
              //     //   { cond: 'isGameOver', target: 'GameOver' },
              //     //   {
              //     //     target: 'EnteringPrompt',
              //     //   },
              //     // ],
              //   },
              // },
            },
            exit: assign({
              predictionUrl: undefined,
            }),
          },
          GameOver: {
            type: 'final' as const,
          },
        },
        onDone: 'Summary',
      },
      Summary: {
        type: 'final' as const,
      },
    },
  },
  {
    guards: {
      isGameOver: () => {
        return false;
      },
    },
  }
);

export type DiffusionarySharedMachine = typeof diffusionarySharedMachine;
export type DiffusionarySharedActor = ActorRefFrom<DiffusionarySharedMachine>;
export type DiffusionarySharedState = StateFrom<DiffusionarySharedMachine>;
