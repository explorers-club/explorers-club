import {
  ActorEvent,
  ActorEventType,
  ActorManager,
  MachineFactory,
  SerializedSharedActor,
} from '@explorers-club/actor';
import {
  createPartyMachine,
  createPartyPlayerMachine,
  getPartyActorId,
  getPartyPlayerActorId,
  PartyActor,
} from '@explorers-club/party';
import { User } from '@supabase/supabase-js';
import {
  onChildAdded,
  onDisconnect,
  onValue,
  push,
  ref,
  set,
} from 'firebase/database';
import { ActorRefFrom, assign, DoneInvokeEvent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { createAnonymousUser } from '../../lib/auth';
import { db } from '../../lib/firebase';
import { supabaseClient } from '../../lib/supabase';

MachineFactory.registerMachine('PARTY_ACTOR', createPartyMachine);
MachineFactory.registerMachine('PLAYER_ACTOR', createPartyPlayerMachine);

const partyScreenModel = createModel(
  {
    userId: undefined as string | undefined,
    playerName: undefined as string | undefined,
    actorManager: {} as ActorManager,
    partyActor: undefined as PartyActor | undefined,
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
  const actorManager = new ActorManager(partyActorId);

  return partyScreenModel.createMachine(
    {
      initial: 'Connecting',
      context: {
        userId,
        partyActor: undefined,
        playerName: undefined,
        actorManager,
      },
      states: {
        Connecting: {
          invoke: {
            src: 'connectToParty',
            onDone: {
              target: 'Connected',
              actions: assign({
                partyActor: (context, event: DoneInvokeEvent<PartyActor>) =>
                  event.data,
              }),
            },
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
                      actions: 'assignPlayerName',
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
            switch (event.type) {
              case 'INPUT_CHANGE_PLAYER_NAME':
                return event.playerName;
              default:
                return context.playerName;
            }
          },
        }),
      },
      guards: {
        isLoggedIn: (context) => !!context.userId,
        isPlayerNameValid: (context) => !!context.playerName,
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
        connectToParty: async (context, event) => {
          return new Promise((resolve, reject) => {
            const actorsRef = ref(db, `parties/${joinCode}/actors`);
            const eventsRef = ref(db, `parties/${joinCode}/events`);

            onChildAdded(eventsRef, (snap) => {
              const event = snap.val() as ActorEvent;

              if (event.type === ActorEventType.SPAWN) {
                const hadRootActor = !!actorManager.rootActor;

                // TODO fix event 'type' typings to avoid this cast
                actorManager.hydrate(event.payload as SerializedSharedActor);

                const didSpawnRootActor =
                  !hadRootActor && !!actorManager.rootActor;
                if (didSpawnRootActor) {
                  resolve(actorManager.rootActor);
                  // TODO remove this listener after we're done
                }
              }
            });

            onValue(
              actorsRef,
              (snap) => {
                const actorData = (snap.val() || []) as SerializedSharedActor[];
                actorManager.hydrateAll(actorData);

                initializePartyPresence(joinCode);

                if (actorManager.rootActor) {
                  resolve(actorManager.rootActor);
                }
              },
              {
                onlyOnce: true,
              }
            );
          });

          // const actorId = getPartyPlayerActorId(userId);

          // const myActorRef = ref(db, `parties/${joinCode}/actors/${actorId}`)

          // onValue(
          //   actorsRef,
          //   (snap) => {
          //     console.log('actor value', snap.val());
          //     if (snap.val()) {
          //       console.log(snap.val());
          //       // const con = push(userConnectionsRef);
          //       // onDisconnect(con).remove();
          //       // set(con, joinCode);
          //     }
          //   },
          //   {
          //     onlyOnce: true,
          //   }
          // );

          // initializePartyPresence(joinCode);
        },
      },
    }
  );
};

const initializePartyPresence = (joinCode: string) => {
  const userConnectionsRef = ref(db, 'user_party_connections');

  // Set up presence handler
  const connectedRef = ref(db, '.info/connected');
  onValue(connectedRef, (snap) => {
    if (snap.val()) {
      const con = push(userConnectionsRef);
      onDisconnect(con).remove();
      set(con, joinCode);
    }
  });
};

export type PartyScreenActor = ActorRefFrom<
  ReturnType<typeof createPartyScreenMachine>
>;
