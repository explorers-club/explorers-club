import {
  ActorEvent,
  ActorEvents,
  ActorManager,
  isSendEvent,
  isSpawnEvent,
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
import { noop } from '@explorers-club/utils';
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
import { db } from '../../lib/firebase';
import { AuthActor } from '../../state/auth.machine';
import { createAnonymousUser } from '../../state/auth.utils';

MachineFactory.registerMachine('PARTY_ACTOR', createPartyMachine);
MachineFactory.registerMachine('PLAYER_ACTOR', createPartyPlayerMachine);

const partyScreenModel = createModel(
  {
    playerName: undefined as string | undefined,
    actorManager: {} as ActorManager,
    partyActor: undefined as PartyActor | undefined,
    authActor: {} as AuthActor,
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
  authActor: AuthActor;
}

export const createPartyScreenMachine = ({
  joinCode,
  authActor,
}: CreateMachineProps) => {
  const partyActorId = getPartyActorId(joinCode);
  const actorManager = new ActorManager(partyActorId);
  const actorsRef = ref(db, `parties/${joinCode}/actors`);
  const eventsRef = ref(db, `parties/${joinCode}/events`);

  return partyScreenModel.createMachine(
    {
      initial: 'Connecting',
      context: {
        partyActor: undefined,
        playerName: undefined,
        actorManager,
        authActor,
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
      predictableActionArguments: true,
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
        isLoggedIn: ({ authActor }) =>
          !!authActor.getSnapshot()?.matches('Authenticated'),
        isPlayerNameValid: (context) => !!context.playerName,
      },
      services: {
        createAccount: ({ authActor }) => createAnonymousUser(authActor),
        joinParty: async () => {
          // Make sure we're logged in
          const userId = authActor.getSnapshot()?.context.session?.user.id;
          if (!userId) {
            throw new Error('trying to join party without being logged in');
          }

          // Spawn the player actor
          const actorId = getPartyPlayerActorId(userId);
          const actorType = 'PLAYER_ACTOR';

          const myActor = actorManager.spawn({
            actorId,
            actorType,
          });
          actorManager.myActorId = actorId;

          // Send the actors events up to the network
          myActor.onEvent((event) => {
            const newEventRef = push(eventsRef);
            set(
              newEventRef,
              ActorEvents.SEND({
                actorId,
                event,
              })
            );
          });

          // Spawn the player actor on the network
          const spawnActorEventRef = push(eventsRef);
          set(
            spawnActorEventRef,
            ActorEvents.SPAWN({
              actorId,
              actorType,
              actor: myActor,
            })
          ).then(noop);

          return myActor;
        },
        connectToParty: async (context, event) => {
          return new Promise((resolve, reject) => {
            onChildAdded(eventsRef, (snap) => {
              const event = snap.val() as ActorEvent;

              if (isSpawnEvent(event)) {
                const hadRootActor = !!actorManager.rootActor;

                actorManager.hydrate(event.payload);

                const didSpawnRootActor =
                  !hadRootActor && !!actorManager.rootActor;
                if (didSpawnRootActor) {
                  resolve(actorManager.rootActor);
                  // TODO remove this listener after we're done
                }
              } else if (isSendEvent(event)) {
                const { actorId } = event.payload;
                const actor = actorManager.getActor(actorId);
                if (actor) {
                  actor.send(event.payload.event);
                } else {
                  console.debug('warning: no actor found for event', event);
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
