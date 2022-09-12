import {
  ActorEventType,
  ActorInitializeEvent,
  ActorSendEvent,
} from '@explorers-club/actor';
import { PartyActor, partyMachine } from '@explorers-club/party';
import { RealtimeChannel } from '@supabase/supabase-js';
import {
  ActorRefFrom,
  assign,
  ContextFrom,
  DoneInvokeEvent,
  interpret,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { supabaseClient } from '../lib/supabase';

const partyConnectionModel = createModel(
  {
    joinCode: null as string | null,
    channel: null as RealtimeChannel | null,
    partyActor: undefined as PartyActor | undefined,
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
export const PARTY_CONNECTION_EVENTS = partyConnectionModel.events;

export type PartyConnectionContext = ContextFrom<typeof partyConnectionModel>;

export const createPartyConnectionMachine = () => {
  return partyConnectionModel.createMachine(
    {
      id: 'ClientPartyMachine',
      initial: 'Uninitialized',
      context: partyConnectionModel.initialContext,
      states: {
        Uninitialized: {
          on: {
            CONNECT: {
              target: 'Connecting',
              actions: partyConnectionModel.assign({
                joinCode: (context, event) => event.joinCode,
                channel: (context, event) =>
                  supabaseClient.channel(`party-${event.joinCode}`, {
                    config: {
                      broadcast: { ack: true },
                    },
                  }),
              }),
            },
          },
        },
        Connecting: {
          invoke: {
            src: 'connectToParty',
            onDone: {
              target: 'Connected',
              actions: assign({
                partyActor: (_, event: DoneInvokeEvent<PartyActor>) =>
                  event.data,
              }),
            },
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
    },
    {
      services: {
        connectToParty: async (context) => {
          const user = (await supabaseClient.auth.getUser()).data.user;
          if (!user) {
            throw new Error('trying to connect to party without user');
          }

          const channel = context.channel;
          if (!channel) {
            throw new Error('tried to connect to party without channel set');
          }

          const partyActor = await initializeChannel({
            channel,
            userId: user.id,
          });

          return partyActor;
        },
      },
    }
  );
};

interface InitializeChannelProps {
  channel: RealtimeChannel;
  userId: string;
}

const initializeChannel = async ({
  channel,
  userId,
}: InitializeChannelProps) => {
  const partyActor = await new Promise<PartyActor>((resolve, reject) => {
    // TODO add timeout in case 'initialize' event doesn't come as expected...
    channel
      .on(
        'broadcast',
        { event: ActorEventType.INITIALIZE },
        ({ payload }: ActorInitializeEvent) => {
          const { state } = payload;
          const actor = interpret(partyMachine);
          actor.start(state);
          resolve(actor);
        }
      )
      .on(
        'broadcast',
        { event: ActorEventType.SEND },
        ({ payload }: ActorSendEvent) => {
          const { event } = payload;
          if (partyActor) {
            partyActor.send(event);
          }
        }
      )
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId,
          });
        }
        // TODO error / retry handle...
      });
  });
  return partyActor;
};

export type PartyConnectionMachine = ReturnType<
  typeof createPartyConnectionMachine
>;
export type PartyConnectionState = StateFrom<PartyConnectionMachine>;
export type PartyConnectionActor = ActorRefFrom<PartyConnectionMachine>;
