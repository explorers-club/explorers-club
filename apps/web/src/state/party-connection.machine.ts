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
  PartyPlayerActor,
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
    me: null as PartyPlayerActor | null,
    partyActor: undefined as PartyActor | undefined,
    actorManager: undefined as ActorManager | undefined,
  },
  {
    events: {
      CONNECT: (joinCode: string) => ({ joinCode }),
      JOIN: (userId: string) => ({ userId }),
    },
  }
);
export const PartyConnectionEvents = partyConnectionModel.events;

export type PartyConnectionContext = ContextFrom<typeof partyConnectionModel>;

interface CreateMachineProps {
  joinCode: string;
}

export const createPartyConnectionMachine = ({
  joinCode,
}: CreateMachineProps) => {
  const channel = supabaseClient.channel(`party-${joinCode}`, {
    config: {
      broadcast: { ack: true },
    },
  });

  return partyConnectionModel.createMachine(
    {
      id: `PartyConnection-${joinCode}`,
      initial: 'Connecting',
      context: partyConnectionModel.initialContext,
      states: {
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
          initial: 'Previewing',
          states: {
            Previewing: {
              on: {
                JOIN: 'Joining',
              },
            },
            Joining: {
              invoke: {
                src: 'joinParty',
              },
            },
            Joined: {},
          },
        },
        Error: {},
      },
    },
    {
      services: {
        joinParty: async (context, event) => {
          if (event.type === 'JOIN') {
            const { userId } = event;
            await channel.track({
              userId,
            });
          }
        },
        connectToParty: async (context) => {
          const actorManager = await initializeChannelActors({
            channel,
            joinCode,
          });

          // to not go to next step until hydrated
          await new Promise((resolve) => {
            actorManager.once('HYDRATE_ALL', resolve);
          });

          return actorManager;
        },
      },
    }
  );
};

interface InitializeChannelProps {
  channel: RealtimeChannel;
  joinCode: string;
}

const initializeChannelActors = async ({
  channel,
  joinCode,
}: InitializeChannelProps) => {
  const partyActorId = getPartyActorId(joinCode);
  const actorManager = new ActorManager(channel, partyActorId);

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
