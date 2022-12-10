import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';

const diffusionarySharedModel = createModel({
  playerUserIds: [] as string[],
  scoresByUserId: {} as Record<string, number>,
  currentPlayer: undefined as string | undefined,
  currentRound: 1 as number,
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
  onPlayerEnterPrompt: () => Promise<void>;
};

export const diffusionarySharedMachine = createMachine(
  {
    id: 'DiffusionarySharedMachine',
    initial: 'Loading',
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
              onDone: 'Guessing',
            },
          },
          Guessing: {
            invoke: {
              id: 'onPlayerSubmitResponse',
              src: 'onPlayerSubmitResponse',
              onDone: [
                {
                  cond: 'isGameOver',
                  target: 'GameOver',
                },
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
