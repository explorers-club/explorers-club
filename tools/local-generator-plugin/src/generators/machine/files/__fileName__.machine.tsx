import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';

const <%= propertyName %>Model = createModel({}, {});

export const <%= name %>Events = <%= propertyName %>Model.events;
export type <%= name %>Context = ContextFrom<typeof <%= propertyName %>Model>;
export type <%= name %>Event = EventFrom<typeof <%= propertyName %>Model>;

export const <%= propertyName %>Machine = createMachine({
  id: '<%= name %>Machine',
  initial: 'Loading',
  states: {
    Loading: {},
  },
});

export type <%= name %>Machine = typeof <%= propertyName %>Machine;
export type <%= name %>Actor = ActorRefFrom<<%= name %>Machine>;
export type <%= name %>State = StateFrom<<%= name %>Machine>;
