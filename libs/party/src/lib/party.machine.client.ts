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

function getRandomUser() {
  const users = ['Alice', 'Bob', 'Mallory', 'Inian'];
  return users[Math.floor(Math.random() * users.length)];
}

const connectToParty = async (
  joinCode: string,
  supabaseClient: ECSupabaseClient
) => {
  const channel = supabaseClient.channel(`party-${joinCode}`);
  const user = getRandomUser();
  channel
    .on('presence', { event: 'sync' }, () => {
      console.log(channel.presenceState());
    })
    .on('presence', { event: 'join' }, (p: unknown) => {
      console.log('join', p);
    })
    .on('presence', { event: 'leave' }, (p: unknown) => {
      console.log('leave', p);
    })
    .subscribe(async (status: string) => {
      console.log({ status });
      if (status === 'SUBSCRIBED') {
        await channel.track({ user });
      }
    });

  return 'todo!';
};

interface CreateClientPartyMachineProps {
  supabaseClient: ECSupabaseClient;
}

export const createClientPartyMachine = ({
  supabaseClient,
}: CreateClientPartyMachineProps) => {
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
