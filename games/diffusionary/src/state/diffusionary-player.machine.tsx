import { unwrapEvent } from '@explorers-club/actor';
import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';
import { assign } from 'xstate/lib/actions';
import { createModel } from 'xstate/lib/model';

const diffusionaryPlayerModel = createModel(
  {
    playerName: undefined as string | undefined,
  },
  {
    events: {
      SET_PLAYER_NAME: (name: string) => ({ name }),
    },
  }
);

export const DiffusionaryPlayerEvents = diffusionaryPlayerModel.events;
export type DiffusionaryPlayerContext = ContextFrom<
  typeof diffusionaryPlayerModel
>;
export type DiffusionaryPlayerEvent = EventFrom<typeof diffusionaryPlayerModel>;

export const diffusionaryPlayerMachine = createMachine({
  id: 'DiffusionaryPlayerMachine',
  initial: 'Loading',
  schema: {
    context: {} as DiffusionaryPlayerContext,
  },
  on: {
    SET_PLAYER_NAME: {
      actions: assign({
        playerName: (_, event) => {
          const { name } = unwrapEvent<DiffusionaryPlayerEvent>(
            event,
            'SET_PLAYER_NAME'
          );
          return name;
        },
      }),
    },
  },
  states: {
    Loading: {
      on: {},
    },
  },
});

export type DiffusionaryPlayerMachine = typeof diffusionaryPlayerMachine;
export type DiffusionaryPlayerActor = ActorRefFrom<DiffusionaryPlayerMachine>;
export type DiffusionaryPlayerState = StateFrom<DiffusionaryPlayerMachine>;
