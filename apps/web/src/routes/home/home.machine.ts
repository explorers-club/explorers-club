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
    events: {},
  }
);

export const homeMachine = createMachine(
  {
    id: 'homeMachine',
    initial: 'Init',
    context: homeModel.initialContext,
    states: {
      Init: {},
    },
  },
  {
    guards: {},
  }
);

export type HomeContext = ContextFrom<typeof homeModel>;
export type HomeEvent = EventFrom<typeof homeModel>;
export type HomeActor = ActorRefFrom<typeof homeMachine>;
export type HomeState = StateFrom<typeof homeMachine>;

export default homeMachine;
