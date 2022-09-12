import {
  ActorEventType,
  ActorInitializeEvent,
  ActorMachineMap,
  ActorSendEvent,
} from '@explorers-club/actor';
import { RealtimeChannel } from '@supabase/supabase-js';
import { ActorRefFrom, AnyActorRef, ContextFrom, interpret } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { supabaseClient } from '../lib/supabase';

const partyConnectionModel = createModel(
  {
    joinCode: null as string | null,
    channel: null as RealtimeChannel | null,
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

          await initializeChannel({
            channel,
            userId: user.id,
          });

          return;
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
  const actorMap = new Map<string, AnyActorRef>();

  await new Promise((resolve, reject) => {
    channel
      .on(
        'broadcast',
        { event: ActorEventType.INITIALIZE },
        ({ payload }: ActorInitializeEvent) => {
          // If we don't already have this actor, initialize it...
          const { actorId, actorType, state } = payload;

          if (!actorMap.has(actorId)) {
            const machine = ActorMachineMap[actorType];
            const actor = interpret(machine).start(state);
            console.log("actor snap", actor.getSnapshot());

            actorMap.set(actorId, actor);
          } else {
            // console.warn(`actor ${actorId} already initialized`);
          }
        }
      )
      .on(
        'broadcast',
        { event: ActorEventType.SEND },
        ({ payload }: ActorSendEvent) => {
          const { actorId, event } = payload;
          const actor = actorMap.get(actorId);
          if (actor) {
            actor.send(event);
          } else {
            console.warn(`Could not find actor ${actorId} for event: `, event);
          }
        }
      )
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId,
          });
          resolve(null);
        } else {
          reject();
        }
      });
  });
  return;
};

type PartyConnectionMachine = ReturnType<typeof createPartyConnectionMachine>;
export type PartyConnectionActor = ActorRefFrom<PartyConnectionMachine>;
