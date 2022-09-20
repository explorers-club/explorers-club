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
  getPartyPlayerActorId,
} from '@explorers-club/party';
import { User } from '@supabase/supabase-js';
import { ActorRefFrom, assign, DoneInvokeEvent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { createAnonymousUser } from '../../lib/auth';
import { supabaseClient } from '../../lib/supabase';

MachineFactory.registerMachine('PARTY_ACTOR', createPartyMachine);
MachineFactory.registerMachine('PLAYER_ACTOR', createPartyPlayerMachine);

const partyScreenModel = createModel(
  {
    userId: undefined as string | undefined,
    playerName: undefined as string | undefined,
  },
  {
    events: {
      INPUT_CHANGE_PLAYER_NAME: (value: string) => ({ playerName: value }),
      PRESS_SUBMIT: () => ({}),
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
  userId: string | undefined;
}

export const createPartyScreenMachine = ({
  joinCode,
  userId,
}: CreateMachineProps) => {
  const partyActorId = getPartyActorId(joinCode);
  const channel = supabaseClient.channel(`party-${joinCode}`);
  const actorManager = new ActorManager(channel, partyActorId);

  return partyScreenModel.createMachine(
    {
      initial: 'Connecting',
      context: {
        userId,
        playerName: undefined,
      },
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
                PRESS_JOIN: [
                  {
                    cond: 'isLoggedIn',
                    target: 'Joining',
                  },
                  {
                    target: 'CreateAccount',
                  },
                ],
              },
            },
            CreateAccount: {
              initial: 'EnteringName',
              states: {
                EnteringName: {
                  on: {
                    INPUT_CHANGE_PLAYER_NAME: {
                      target: 'EnteringName',
                      actions: ['assignPlayerName'],
                    },
                    PRESS_SUBMIT: [
                      {
                        target: 'Creating',
                        cond: 'isPlayerNameValid',
                      },
                      {
                        target: 'EnteringName',
                        // TODO action to set validation error here
                      },
                    ],
                  },
                },
                Creating: {
                  invoke: {
                    src: 'createAccount',
                    onDone: {
                      target: 'Created',
                      actions: assign({
                        userId: (_, event: DoneInvokeEvent<User>) =>
                          event.data.id,
                      }),
                    },
                    onError: 'CreateError',
                  },
                },
                CreateError: {},
                Created: {
                  type: 'final' as const,
                },
              },
              onDone: 'Joining',
            },
            Joining: {
              invoke: {
                src: 'joinParty',
                onDone: 'Joined',
                onError: 'JoinError',
              },
            },
            JoinError: {},
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
      actions: {
        assignPlayerName: partyScreenModel.assign({
          playerName: (context, event) => {
            if (event.type === 'INPUT_CHANGE_PLAYER_NAME') {
              return event.playerName;
            }
            return context.playerName;
          },
        }),
      },
      guards: {
        isLoggedIn: (context, event) => !!context.userId,
        isPlayerNameValid: (context) => {
          console.log(context.playerName);
          return !!context.playerName;
        },
      },
      services: {
        createAccount: async ({ playerName }) => {
          // TODO set name on profile
          return await createAnonymousUser();
        },
        joinParty: async () => {
          // TODO get userId from somewhere else
          const userId = (await supabaseClient.auth.getSession()).data.session
            ?.user.id;
          if (!userId) {
            throw new Error('trying to join party without being logged in');
          }

          const actorId = getPartyPlayerActorId(userId);
          const myActor = actorManager.spawn({
            actorId,
            actorType: 'PLAYER_ACTOR',
          });

          return myActor;
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
                  const userId = (await supabaseClient.auth.getSession()).data
                    .session?.user.id;

                  const resp = await channel.track({
                    userId,
                  });

                  if (resp !== 'ok') {
                    console.error(resp);
                  }
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
