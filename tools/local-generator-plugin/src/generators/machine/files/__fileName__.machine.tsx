import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';

export interface <%= name %>Context {
  hello: "world" as const
}

export interface <%= name %>Event {
  type: "FOO"
}

export const <%= propertyName %>Machine = createMachine({
  id: '<%= name %>Machine',
  initial: 'Loading',
  schema: {
    context: {} as <%= name %>Context,
    events: {} as <%= name %>Event,
  },
  states: {
    Loading: {},
  },
});

export type <%= name %>Machine = typeof <%= propertyName %>Machine;
export type <%= name %>Actor = ActorRefFrom<<%= name %>Machine>;
export type <%= name %>State = StateFrom<<%= name %>Machine>;
