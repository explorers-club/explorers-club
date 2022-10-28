import {
  ActorManager,
  MachineFactory,
  ManagedActor,
  SerializedSharedActor,
  setActorEvent,
  setActorState,
  SharedActorEvent,
  SharedActorRef,
} from '@explorers-club/actor';
import {
  createPartyMachine,
  createPartyPlayerMachine,
  getPartyActorId,
  getPartyPlayerActorId,
  PartyActor,
  PartyPlayerActor,
  PartyPlayerEvents,
} from '@explorers-club/party';
import { get, onDisconnect, onValue, push, ref, set } from 'firebase/database';
import { fromRef, ListenEvent } from 'rxfire/database';
import { filter, first, from, fromEvent } from 'rxjs';
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
    myActor: undefined as PartyPlayerActor | undefined,
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

  return partyScreenModel.createMachine(
    {
      initial: 'Connecting',
      context: {
        myActor: undefined,
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
          initial: 'Initializing',
          states: {
            Initializing: {
              invoke: {
                src: 'waitForAuthInit',
                onDone: [
                  {
                    // Resume playing if they were previously connected
                    cond: 'isInParty',
                    target: 'Joined',
                    actions: 'assignMyActor',
                  },
                  {
                    target: 'Spectating',
                  },
                ],
              },
            },
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
                onDone: {
                  target: 'Joined',
                  actions: 'assignMyActor',
                },
                onError: 'JoinError',
              },
            },
            JoinError: {},
            Joined: {},
          },
        },
        Disconnected: {},
      },
      predictableActionArguments: true,
    },
    {
      actions: {
        assignMyActor: partyScreenModel.assign({
          myActor: ({ authActor }) => {
            const userId = authActor.getSnapshot()?.context.session?.user.id; // lol
            if (!userId) {
              throw new Error('trying to assign actor without being logged in');
            }

            const actorId = getPartyPlayerActorId(userId);
            return actorManager.getActor(actorId);
          },
        }),
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
        isInParty: ({ authActor, actorManager }) => {
          const userId = authActor.getSnapshot()?.context.session?.user.id; // lol
          if (!userId) {
            return false;
          }

          const actorId = getPartyPlayerActorId(userId);
          const partyActor = actorManager.rootActor as PartyActor;

          return partyActor
            .getSnapshot()
            ?.context.playerActorIds.includes(actorId) as boolean;
        },
        isLoggedIn: ({ authActor }) =>
          !!authActor.getSnapshot()?.matches('Authenticated'),
        isPlayerNameValid: (context) => !!context.playerName,
      },
      services: {
        waitForAuthInit: ({ authActor }) => {
          return new Promise((resolve) => {
            from(authActor)
              // Wait for first state not in Initializing
              // TODO: is there a good way to type the states strings?
              .pipe(
                filter((state) => !state.matches('Initializing')),
                first()
              )
              .subscribe(resolve);
          });
        },
        createAccount: ({ authActor }) => createAnonymousUser(authActor),
        joinParty: async () => {
          // Make sure we're logged in
          const userId = authActor.getSnapshot()?.context.session?.user.id;
          if (!userId) {
            throw new Error('trying to join party without being logged in');
          }

          // Create my actor, persist its state, then
          // add it to the list of actors on the network
          const sharedActorRef: SharedActorRef = {
            actorId: getPartyPlayerActorId(userId),
            actorType: 'PLAYER_ACTOR',
          };
          const { actorId } = sharedActorRef;

          const myActor = actorManager.spawn(sharedActorRef);
          actorManager.myActorId = actorId;
          const myActorRef = ref(
            db,
            `parties/${joinCode}/actor_state/${actorId}`
          );
          const stateJSON = JSON.stringify(myActor.getSnapshot());
          await setActorState(myActorRef, { ...sharedActorRef, stateJSON });

          const myEventRef = ref(
            db,
            `parties/${joinCode}/actor_events/${actorId}`
          );
          myActor.onEvent(async (event) => {
            await setActorEvent(myEventRef, { actorId, event });
          });

          // Send disconnect event when we disconnect
          onDisconnect(myEventRef).set({
            actorId,
            event: PartyPlayerEvents.PLAYER_DISCONNECT(),
          });

          return myActor;
        },
        connectToParty: async (context, event) => {
          const stateRef = ref(db, `parties/${joinCode}/actor_state`);
          const eventsRef = ref(db, `parties/${joinCode}/actor_events`);
          let initialized = false;

          return new Promise((resolve, reject) => {
            // Listen for events on all actors in the party
            const newEvent$ = fromRef(eventsRef, ListenEvent.changed);
            newEvent$.pipe(first()).subscribe((changes) => {
              // Wait until we're initialized before sending new events...
              if (!initialized) {
                return;
              }

              const { actorId, event } =
                changes.snapshot.val() as SharedActorEvent;
              console.log('new event', actorId, event);

              // Don't send events on our own actor
              if (actorManager.myActorId === actorId) {
                return;
              }

              const actor = actorManager.getActor(actorId);
              if (!actor) {
                console.warn("Couldn't find actor " + actorId);
                return;
              }

              actor.send(event);
            });

            // Listen for new actors and hydrate them
            const actorAdded$ = fromRef(stateRef, ListenEvent.added);
            actorAdded$.subscribe((change) => {
              // Wait until the party actor is initialized before
              // responding to new changes
              if (!initialized) {
                return;
              }

              const serializedActor =
                change.snapshot.val() as SerializedSharedActor;
              actorManager.hydrate(serializedActor);
            });

            // Get initial state and hydrate it
            get(stateRef).then((stateSnapshot) => {
              const stateMap = (stateSnapshot.val() || {}) as Record<
                string,
                SerializedSharedActor
              >;
              const serializedActors = Object.values(stateMap);
              actorManager.hydrateAll(serializedActors);
              initialized = true;
            });

            initializePartyPresence(joinCode);

            // Once the party is actor is hydrated, we are "connected"
            const hydrate$ = fromEvent<ManagedActor>(actorManager, 'HYDRATE');
            hydrate$
              .pipe(filter(isPartyActor), first())
              .subscribe(({ actor }) => {
                resolve(actor);
              });
          });
        },
      },
    }
  );
};

const isPartyActor = (managedActor: ManagedActor) => {
  return managedActor.actorType === 'PARTY_ACTOR';
};

/**
 * Add ourselves to `user_party_connections` when we connect
 * and remove when we disconnect. This is how party server
 * knows which parties to spawn.
 */
const initializePartyPresence = (joinCode: string) => {
  const userConnectionsRef = ref(db, 'user_party_connections');

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
