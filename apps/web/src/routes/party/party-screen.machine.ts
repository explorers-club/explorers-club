import {
  ActorEventType,
  ActorManager,
  SpawnActorEvent,
  SyncActorsEvent,
} from '@explorers-club/actor';
import { getPartyActorId } from '@explorers-club/party';
import { ActorRefFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { supabaseClient } from '../../lib/supabase';

const partyScreenModel = createModel(
  {},
  {
    events: {
      PRESS_JOIN: () => ({}),
      PRESS_READY: () => ({}),
      PRESS_START_GAME: () => ({}),
      PRESS_UNREADY: () => ({}),
    },
  }
);

export const PartyScreenEvents = partyScreenModel.events;

interface CreateMachineProps {
  joinCode: string;
}

export const createPartyScreenMachine = ({ joinCode }: CreateMachineProps) => {
  const partyActorId = getPartyActorId(joinCode);
  const channel = supabaseClient.channel(`Party-${joinCode}`);
  const actorManager = new ActorManager(channel, partyActorId);

  return partyScreenModel.createMachine(
    {
      initial: 'Connecting',
      context: {},
      states: {
        Connecting: {
          invoke: {
            src: 'connectToParty',
            onDone: 'Connected',
            onError: 'Disconnected',
          },
        },
        Connected: {
          initial: 'Spectating',
          states: {
            Spectating: {
              on: {
                PRESS_JOIN: 'Joining',
              },
            },
            Joining: {
              invoke: {
                src: 'joinParty',
              },
            },
            Joined: {
              initial: 'NotReady',
              states: {
                NotReady: {
                  on: {
                    PRESS_READY: 'Ready',
                  },
                },
                Ready: {
                  on: {
                    PRESS_UNREADY: 'NotReady',
                  },
                },
              },
            },
          },
        },
        Disconnected: {},
      },
    },
    {
      services: {
        joinParty: async () => {
          const userId = (await supabaseClient.auth.getSession()).data.session
            ?.user.id;

          const resp = await channel.track({ userId });
          if (resp !== 'ok') {
            throw new Error('non-ok response when joining party' + resp);
          }
        },
        connectToParty: () => {
          return new Promise((resolve) => {
            const handleSyncActors = async ({ payload }: SyncActorsEvent) => {
              actorManager.hydrateAll(payload);
            };

            const handleSpawnActor = async ({ payload }: SpawnActorEvent) => {
              actorManager.hydrate(payload);
            };

            channel
              .on(
                'broadcast',
                { event: ActorEventType.SYNC_ALL },
                handleSyncActors
              )
              .on(
                'broadcast',
                { event: ActorEventType.SPAWN },
                handleSpawnActor
              )
              .subscribe(async (status: string) => {
                if (status === 'SUBSCRIBED') {
                  resolve(null);
                }
              });
          });
        },
      },
    }
  );
};

export type PartyScreenActor = ActorRefFrom<
  ReturnType<typeof createPartyScreenMachine>
>;
