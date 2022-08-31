import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';

export const partyModel = createModel(
  {},
  {
    events: {},
  }
);

export const partyMachine = createMachine(
  {
    id: 'partyMachine',
    initial: 'Init',
    context: partyModel.initialContext,
    states: {
      Init: {},
    },
  },
  {
    guards: {},
  }
);

export type PartyContext = ContextFrom<typeof partyModel>;
export type PartyEvent = EventFrom<typeof partyModel>;
export type PartyActor = ActorRefFrom<typeof partyMachine>;
export type PartyState = StateFrom<typeof partyMachine>;

export default partyMachine;
