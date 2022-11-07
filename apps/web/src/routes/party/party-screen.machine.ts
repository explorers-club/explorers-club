import {
  ActorManager,
  ActorType,
  getActorId,
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
  PartyActor,
  PartyPlayerActor,
  PartyPlayerEvents,
} from '@explorers-club/party';
import {
  createTriviaJamMachine,
  createTriviaJamPlayerMachine,
} from '@explorers-club/trivia-jam/state';
import { get, onDisconnect, onValue, push, ref, set } from 'firebase/database';
import { fromRef, ListenEvent } from 'rxfire/database';
import { filter, first, from, fromEvent, skipWhile } from 'rxjs';
import { ActorRefFrom, assign, DoneInvokeEvent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { db } from '../../lib/firebase';
import { AuthActor } from '../../state/auth.machine';
import { createAnonymousUser } from '../../state/auth.utils';

MachineFactory.registerMachine(ActorType.PARTY_ACTOR, createPartyMachine);
MachineFactory.registerMachine(
  ActorType.PARTY_PLAYER_ACTOR,
  createPartyPlayerMachine
);
MachineFactory.registerMachine(
  ActorType.TREEHOUSE_TRIVIA_ACTOR,
  createTriviaJamMachine
);
MachineFactory.registerMachine(
  ActorType.TREEHOUSE_TRIVIA_PLAYER_ACTOR,
  createTriviaJamPlayerMachine
);

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
  const partyActorId = getActorId(ActorType.PARTY_ACTOR, joinCode);
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
          entry: 'wirePartyClient',
          states: {
            Initializing: {
              invoke: {
                src: 'waitForAuthInit',
                onDone: [
                  {
                    // Resume playing if they were previously connected
                    cond: 'isInParty',
                    target: 'Rejoining',
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
                    cond: 'isNotLoggedIn',
                    target: 'CreateAccount',
                  },
                  {
                    target: 'Joining',
                  },
                ],
              },
            },
            CreateAccount: {
              initial: 'Creating',
              states: {
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
                  target: 'EnteringName',
                  actions: 'assignMyActor',
                },
                onError: 'JoinError',
              },
            },
            EnteringName: {
              on: {
                '': { target: 'Joined', cond: 'hasPlayerName' },
                INPUT_CHANGE_PLAYER_NAME: {
                  target: 'EnteringName',
                  actions: 'assignPlayerName',
                },
                PRESS_SUBMIT: [
                  {
                    target: 'Joined',
                    cond: 'isPlayerNameValid',
                    actions: 'savePlayerName',
                  },
                  {
                    target: 'EnteringName',
                    // TODO action to set validation error here
                  },
                ],
              },
            },
            Rejoining: {
              on: {
                '': { target: 'Joined', actions: 'rejoinParty' },
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
        wirePartyClient: (context) => {
          if (!context.partyActor) {
            throw new Error('expected party actor');
          }

          /**
           * Spawns the actor on the actor manager and initializes actor in the db.
           */
          const spawnPlayerActor = async () => {
            const userId =
              context.authActor.getSnapshot()?.context.session?.user.id;
            if (!userId) {
              throw new Error('expected user id');
            }

            const actorType = ActorType.TREEHOUSE_TRIVIA_PLAYER_ACTOR;
            const actorId = getActorId(actorType, userId);
            const playerActor = actorManager.spawn({ actorId, actorType });
            const eventRef = ref(
              db,
              `parties/${joinCode}/actor_events/${actorId}`
            );
            const stateRef = ref(
              db,
              `parties/${joinCode}/actor_state/${actorId}`
            );

            await setActorState(stateRef, actorManager.serialize(actorId));
            await setActorEvent(eventRef, {
              actorId,
              event: { type: 'INIT' },
            });

            playerActor.onEvent(async (event) => {
              await setActorEvent(eventRef, { actorId, event });
            });

            // TODO maybe set up a disconnect send even here if we need it
            console.log('spawned player actor!', actorId);
          };

          // When party machine enters Game state, spawn the game actor
          const state$ = from(context.partyActor);
          const enterGame$ = state$.pipe(
            filter((state) => state.matches('Lobby.CreatingGame'))
          );
          enterGame$.subscribe(spawnPlayerActor);
        },
        // TODO try up with join party function
        rejoinParty: () => {
          const userId = authActor.getSnapshot()?.context.session?.user.id;
          if (!userId) {
            throw new Error('trying to rejoin party without being logged in');
          }

          const actorId = getActorId(ActorType.PARTY_PLAYER_ACTOR, userId);
          const myActor = actorManager.getActor(actorId);
          if (!myActor) {
            console.warn('couldnt find actor when trying to rejoin');
            return;
          }
          actorManager.myActorId = actorId;

          const myEventRef = ref(
            db,
            `parties/${joinCode}/actor_events/${actorId}`
          );
          myActor.onEvent(async (event) => {
            await setActorEvent(myEventRef, { actorId, event });
          });
          myActor.send(PartyPlayerEvents.PLAYER_REJOIN());

          // Send disconnect event when we disconnect
          onDisconnect(myEventRef).set({
            actorId,
            event: PartyPlayerEvents.PLAYER_DISCONNECT(),
          });

          return myActor;
        },
        savePlayerName: ({ myActor, playerName }) => {
          if (!playerName || !myActor) {
            console.warn('expected player name and actor');
            return;
          }

          myActor.send(PartyPlayerEvents.SET_PLAYER_NAME({ playerName }));
        },
        assignMyActor: partyScreenModel.assign({
          myActor: ({ authActor }) => {
            const userId = authActor.getSnapshot()?.context.session?.user.id;
            if (!userId) {
              throw new Error('trying to assign actor without being logged in');
            }

            const actorId = getActorId(ActorType.PARTY_PLAYER_ACTOR, userId);
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
        hasPlayerName: ({ myActor }) => {
          return !!myActor?.getSnapshot()?.context.playerName;
        },
        isInParty: ({ authActor, actorManager }) => {
          const userId = authActor.getSnapshot()?.context.session?.user.id; // lol
          if (!userId) {
            return false;
          }

          const actorId = getActorId(ActorType.PARTY_PLAYER_ACTOR, userId);
          const partyActor = actorManager.rootActor as PartyActor;

          return partyActor
            .getSnapshot()
            ?.context.playerActorIds.includes(actorId) as boolean;
        },
        isNotLoggedIn: ({ authActor }) =>
          !authActor.getSnapshot()?.matches('Authenticated'),
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
            actorId: getActorId(ActorType.PARTY_PLAYER_ACTOR, userId),
            actorType: ActorType.PARTY_PLAYER_ACTOR,
          };
          const { actorId } = sharedActorRef;

          const myActor = actorManager.spawn(sharedActorRef);
          actorManager.myActorId = actorId;
          const myActorRef = ref(
            db,
            `parties/${joinCode}/actor_state/${actorId}`
          );
          const myEventRef = ref(
            db,
            `parties/${joinCode}/actor_events/${actorId}`
          );

          const stateJSON = JSON.stringify(myActor.getSnapshot());

          // TODO do in transation ?
          await setActorState(myActorRef, { ...sharedActorRef, stateJSON });
          await setActorEvent(myEventRef, {
            actorId: partyActorId,
            event: { type: 'INIT' },
          });

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
        connectToParty: async () => {
          const stateRef = ref(db, `parties/${joinCode}/actor_state`);
          const eventsRef = ref(db, `parties/${joinCode}/actor_events`);
          let initialized = false;

          return new Promise((resolve, reject) => {
            // Listen for events on all actors in the party
            const newEvent$ = fromRef(eventsRef, ListenEvent.changed);
            newEvent$
              .pipe(skipWhile(() => !initialized))
              .subscribe((changes) => {
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

            wirePartyPresence(joinCode);

            // Once the party is actor is hydrated, we are "connected", resolve the promise
            const onPartyActorHydrate = fromEvent<ManagedActor>(
              actorManager,
              'HYDRATE'
            ).pipe(filter(isPartyActor), first());
            onPartyActorHydrate.subscribe(({ actor }) => {
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
const wirePartyPresence = (joinCode: string) => {
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
