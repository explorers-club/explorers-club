import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';

export const homeModel = createModel(
  {},
  {
    events: {
      JOIN_PARTY: (code: string) => ({ code }),
      START_PARTY: () => ({}),
    },
  }
);

// NEXT... in this machine is where we actually do the logic
// to spawn the party machine

export const homeMachine = createMachine({
  id: 'homeMachine',
  initial: 'Idle',
  context: homeModel.initialContext,
  states: {
    Idle: {
      on: {
        JOIN_PARTY: {
          target: 'Complete',
        },
        START_PARTY: {
          actions: "createNewParty",
          target: 'Complete',
        },
      },
    },
    Complete: {
      type: 'final' as const,
    },
  },
});

export type HomeContext = ContextFrom<typeof homeModel>;
export type HomeEvent = EventFrom<typeof homeModel>;
export type HomeActor = ActorRefFrom<typeof homeMachine>;
export type HomeState = StateFrom<typeof homeMachine>;

export default homeMachine;
