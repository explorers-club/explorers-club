import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';

const diffusionarySharedModel = createModel(
  {
    currentTurnUserId: undefined as string | undefined,
    scoresByUserId: {} as Record<number, string>,
  },
  {}
);

export const DiffusionarySharedEvents = diffusionarySharedModel.events;
export type DiffusionarySharedContext = ContextFrom<
  typeof diffusionarySharedModel
>;
export type DiffusionarySharedEvent = EventFrom<typeof diffusionarySharedModel>;

export const diffusionarySharedMachine = createMachine({
  id: 'DiffusionarySharedMachine',
  initial: 'Loading',
  states: {
    Loading: {
      invoke: {
        id: 'onAllPlayersLoaded',
        src: 'onAllPlayersLoaded',
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
            id: 'onCompleteRound',
            src: 'onCompelteRound',
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
});

export type DiffusionarySharedMachine = typeof diffusionarySharedMachine;
export type DiffusionarySharedActor = ActorRefFrom<DiffusionarySharedMachine>;
export type DiffusionarySharedState = StateFrom<DiffusionarySharedMachine>;
