import { assertEventType, unwrapEvent } from '@explorers-club/actor';
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
import { DiffusionaryPlayerEnterPromptEvent } from './diffusionary-player.machine';

const diffusionarySharedModel = createModel({
  playerUserIds: [] as string[],
  scoresByUserId: {} as Record<string, number>,
  currentPlayer: undefined as string | undefined,
  currentRound: 1 as number,
  currentPrompt: undefined as string | undefined,
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
  onAllPlayersReady: () => Promise<{ type: 'ALL_PLAYERS_READY' }>;
  onPlayerEnterPrompt: () => Promise<DiffusionaryPlayerEnterPromptEvent>;
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
                target: 'Guessing',
                actions: assign<
                  DiffusionarySharedContext,
                  DoneInvokeEvent<DiffusionaryPlayerEnterPromptEvent>
                >({
                  currentPrompt: (_, event) => event.data.prompt,
                }),
              },
            },
          },
          Guessing: {
            entry: (context, event) => {
              console.log({ context, event });
            },
            invoke: {
              id: 'onPlayerSubmitResponse',
              src: 'onPlayerSubmitResponse',
              onDone: [
                { cond: 'isGameOver', target: 'GameOver' },
                {
                  target: 'EnteringPrompt',
                },
              ],
            },
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
