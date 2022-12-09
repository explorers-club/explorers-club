import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';

const <%= name %>Model = createModel({}, {});

export const <%= uppercase(name) %>Events = <%= name %>Model.events;
export type <%= uppercase(name) %>Context = ContextFrom<typeof <%= name %>Model>;
export type <%= uppercase(name) %>Event = EventFrom<typeof <%= name %>Model>;

export const <%= name %>Machine = createMachine({
  id: '<%= uppercase(name) %>Machine',
  initial: 'Loading',
  states: {
    Loading: {},
  },
});

export type <%= uppercase(name) %>Machine = typeof <%= name %>Machine;
export type <%= uppercase(name) %>Actor = ActorRefFrom<<%= uppercase(name) %>Machine>;
export type <%= uppercase(name) %>State = StateFrom<<%= uppercase(name) %>Machine>;
