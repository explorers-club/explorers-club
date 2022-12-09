import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';

const diffusionarySharedModel = createModel({}, {});

export const DiffusionarySharedEvents = diffusionarySharedModel.events;
export type DiffusionarySharedContext = ContextFrom<
  typeof diffusionarySharedModel
>;
export type DiffusionarySharedEvent = EventFrom<typeof diffusionarySharedModel>;

export const diffusionarySharedMachine = createMachine({
  id: 'DiffusionarySharedMachine',
  initial: 'Loading',
  states: {
    Loading: {},
  },
});

export type DiffusionarySharedMachine = typeof diffusionarySharedMachine;
export type DiffusionarySharedActor = ActorRefFrom<DiffusionarySharedMachine>;
export type DiffusionarySharedState = StateFrom<DiffusionarySharedMachine>;
