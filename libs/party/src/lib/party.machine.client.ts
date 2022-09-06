import type { ECSupabaseClient, PartiesRow } from '@explorers-club/database';
import { ActorRefFrom, ContextFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const clientPartyModel = createModel(
  {
    joinCode: null as string | null,
    party: undefined as PartiesRow | undefined,
  },
  {
    events: {
      CONNECT: (joinCode: string) => ({ joinCode }),
      DISCONNECT: () => ({}),
      RECONNECT: () => ({}),
      RETRY: () => ({}),
    },
  }
);

export const CLIENT_PARTY_EVENTS = clientPartyModel.events;

export type ClientPartyContext = ContextFrom<typeof clientPartyModel>;

const connectToParty = async (
  joinCode: string,
  supabaseClient: ECSupabaseClient
) => {
  console.log('TODO: connect', joinCode, supabaseClient);
  return 'todo!';
};

export const createClientPartyMachine = (supabaseClient: ECSupabaseClient) => {
  return clientPartyModel.createMachine({
    id: 'ClientPartyMachine',
    initial: 'Uninitialized',
    context: clientPartyModel.initialContext,
    states: {
      Uninitialized: {
        on: {
          CONNECT: {
            target: 'Connecting',
            actions: clientPartyModel.assign({
              joinCode: (context, event) => event.joinCode,
            }),
          },
        },
      },
      Initialized: {
        on: {
          CONNECT: 'Connecting',
        },
      },
      Connecting: {
        invoke: {
          id: 'connectToParty',
          src: ({ joinCode }) => {
            if (!joinCode) {
              throw new Error('tried to connect to party without join code');
            }
            return connectToParty(joinCode, supabaseClient);
          },
          onDone: 'Connected',
          onError: 'Error',
        },
      },
      Connected: {
        on: {
          DISCONNECT: 'Disconnected',
        },
      },
      Error: {
        on: {
          RETRY: 'Connecting',
        },
      },
      Disconnected: {
        on: {
          RECONNECT: 'Connecting',
        },
      },
    },
  });
};

type ClientPartyMachine = ReturnType<typeof createClientPartyMachine>;
export type ClientPartyActor = ActorRefFrom<ClientPartyMachine>;
