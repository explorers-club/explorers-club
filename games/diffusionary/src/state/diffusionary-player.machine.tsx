import { assertEventType, unwrapEvent } from '@explorers-club/actor';
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
      ENTER_PROMPT: (prompt: string) => ({ prompt }),
    },
  }
);

export const DiffusionaryPlayerEvents = diffusionaryPlayerModel.events;
export type DiffusionaryPlayerContext = ContextFrom<
  typeof diffusionaryPlayerModel
>;
export type DiffusionaryPlayerEnterPromptEvent = ReturnType<
  typeof diffusionaryPlayerModel.events.ENTER_PROMPT
>;
export type DiffusionaryPlayerEvent = EventFrom<typeof diffusionaryPlayerModel>;

export const diffusionaryPlayerMachine = createMachine({
  id: 'DiffusionaryPlayerMachine',
  initial: 'Loading',
  schema: {
    context: {} as DiffusionaryPlayerContext,
    events: {} as DiffusionaryPlayerEvent,
  },
  on: {
    SET_PLAYER_NAME: {
      actions: assign<DiffusionaryPlayerContext, DiffusionaryPlayerEvent>({
        playerName: (_, event) => {
          assertEventType(event, 'SET_PLAYER_NAME');
          return event.name;
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
