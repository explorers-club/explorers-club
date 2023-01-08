import { createMachine } from 'xstate';

export interface <%= name %>Context {
  hello: string
}

export type <%= name %>Event = { type: "Foo" };

export const <%= propertyName %>Machine = createMachine({
  id: '<%= name %>Machine',
  initial: 'Idle',
  schema: {
    context: {} as <%= name %>Context,
    events: {} as <%= name %>Event,
  },
  states: {
    Idle: {},
  },
});

export type <%= name %>Machine = typeof <%= propertyName %>Machine;
export type <%= name %>Actor = ActorRefFrom<<%= name %>Machine>;
export type <%= name %>State = StateFrom<<%= name %>Machine>;
