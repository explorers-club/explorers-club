import { ActorRefFrom, ContextFrom, createMachine, EventFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

export const partyModel = createModel(
  {
    partyId: '' as string,
  },
  {
    events: {
      QUIT: () => ({}),
      START_GAME: () => ({}),
      PLAY_AGAIN: () => ({}),
    },
  }
);

const partyMachine = createMachine({
  id: 'PartyMachine',
  initial: 'Lobby',
  states: {
    Lobby: {
      on: {
        START_GAME: {
          target: 'InGame',
        },
      },
    },
    InGame: {
      on: {
        QUIT: {
          target: 'Lobby',
        },
        PLAY_AGAIN: {},
      },
    },
  },
});

export type PartyContext = ContextFrom<typeof partyMachine>;
export type PartyEvent = EventFrom<typeof partyMachine>;
export type PartyActor = ActorRefFrom<typeof partyMachine>;

export const createPartyMachine = (initialContext: PartyContext) =>
  partyMachine.withContext(initialContext);
