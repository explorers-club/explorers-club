import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';

const diffusionaryPlayerModel = createModel({}, {});

export const DiffusionaryPlayerEvents = diffusionaryPlayerModel.events;
export type DiffusionaryPlayerContext = ContextFrom<
  typeof diffusionaryPlayerModel
>;
export type DiffusionaryPlayerEvent = EventFrom<typeof diffusionaryPlayerModel>;

export const diffusionaryPlayerMachine = createMachine({
  id: 'DiffusionaryPlayerMachine',
  initial: 'Loading',
  states: {
    Loading: {},
  },
});

export type DiffusionaryPlayerMachine = typeof diffusionaryPlayerMachine;
export type DiffusionaryPlayerActor = ActorRefFrom<DiffusionaryPlayerMachine>;
export type DiffusionaryPlayerState = StateFrom<DiffusionaryPlayerMachine>;
