import {
  ActorEventType,
  ActorManager,
  MachineFactory,
  SpawnActorEvent,
  SyncActorsEvent,
} from '@explorers-club/actor';
import {
  createPartyMachine,
  createPartyPlayerMachine,
  getPartyActorId,
  PartyActor,
} from '@explorers-club/party';
import { RealtimeChannel } from '@supabase/supabase-js';
import {
  ActorRefFrom,
  assign,
  ContextFrom,
  DoneInvokeEvent,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { supabaseClient } from '../lib/supabase';

MachineFactory.registerMachine('PARTY_ACTOR', createPartyMachine);
MachineFactory.registerMachine('PLAYER_ACTOR', createPartyPlayerMachine);

const partyConnectionModel = createModel(
  {
    joinCode: null as string | null,
    channel: null as RealtimeChannel | null,
    partyActor: undefined as PartyActor | undefined,
    actorManager: undefined as ActorManager | undefined,
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
      id: 'PartyConnection',
      initial: 'Uninitialized',
      context: partyConnectionModel.initialContext,
      states: {
        Uninitialized: {
          on: {
            CONNECT: {
              target: 'Connecting',
              actions: partyConnectionModel.assign({
                joinCode: (_, event) => event.joinCode,
                channel: (_, event) =>
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
                partyActor: (_, event: DoneInvokeEvent<ActorManager>) =>
                  event.data.rootActor as PartyActor,
                actorManager: (_, event: DoneInvokeEvent<ActorManager>) =>
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
          const userId = (await supabaseClient.auth.getUser()).data.user?.id;
          if (!userId) {
            throw new Error('trying to connect to party without user');
          }

          const channel = context.channel;
          if (!channel) {
            throw new Error('tried to connect to party without channel set');
          }

          const joinCode = context.joinCode;
          if (!joinCode) {
            throw new Error('tried to connect to party without join code set');
          }

          const actorManager = await initializeChannelActors({
            userId,
            channel,
            joinCode,
          });

          // to not go to next step until hydrated
          await new Promise((resolve) => {
            actorManager.once('hydrateAll', resolve);
          });

          return actorManager;
        },
      },
    }
  );
};

interface InitializeChannelProps {
  channel: RealtimeChannel;
  userId: string;
  joinCode: string;
}

const initializeChannelActors = async ({
  channel,
  userId,
  joinCode,
}: InitializeChannelProps) => {
  const partyActorId = getPartyActorId(joinCode);
  const actorManager = new ActorManager(channel, partyActorId);

  const handleConnect = async () => {
    await channel.track({
      userId,
    });
  };

  const handleSyncActors = async ({ payload }: SyncActorsEvent) => {
    actorManager.hydrateAll(payload);
  };

  const handleSpawnActor = async ({ payload }: SpawnActorEvent) => {
    actorManager.hydrate(payload);
  };

  await new Promise((resolve, reject) => {
    channel
      .on('broadcast', { event: ActorEventType.SYNC_ALL }, handleSyncActors)
      .on('broadcast', { event: ActorEventType.SPAWN }, handleSpawnActor)
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          await handleConnect();
          resolve(null);
        }
      });
  });

  return actorManager;
};

export type PartyConnectionMachine = ReturnType<
  typeof createPartyConnectionMachine
>;
export type PartyConnectionState = StateFrom<PartyConnectionMachine>;
export type PartyConnectionActor = ActorRefFrom<PartyConnectionMachine>;
