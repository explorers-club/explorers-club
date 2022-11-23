import {
  ActorManager,
  ActorType,
  getActorId,
  // MachineFactory,
  ManagedActor,
  SerializedSharedActor,
  setActorEvent,
  setActorState,
  SharedActorEvent,
  SharedActorRef
} from '@explorers-club/actor';
import {
  PartyActor,
  PartyPlayerActor,
  PartyPlayerEvents
} from '@explorers-club/party';
import { enterNameMachine } from '@organisms/enter-name-form';
import { get, onDisconnect, onValue, push, ref, set } from 'firebase/database';
import { fromRef, ListenEvent } from 'rxfire/database';
import { filter, first, from, fromEvent, skipWhile } from 'rxjs';
import { ActorRefFrom, assign, DoneInvokeEvent, StateFrom } from 'xstate';
import { sendParent } from 'xstate/lib/actions';
import { createModel } from 'xstate/lib/model';
import { waitFor } from 'xstate/lib/waitFor';
import { fetchUserProfileByName } from '../../api/fetchUserProfileByName';
import { db } from '../../lib/firebase';
import { AuthActor } from '../../state/auth.machine';
import {
  selectAuthIsInitalized,
  selectPlayerName,
  selectUserId
} from '../../state/auth.selectors';
import { createAnonymousUser } from '../../state/auth.utils';
import { NavigationEvents } from '../../state/navigation.machine';

const clubScreenModel = createModel(
  {
    hostPlayerName: '' as string,
    authActor: {} as AuthActor,
    actorManager: {} as ActorManager,
    partyActor: undefined as PartyActor | undefined,
    myActor: undefined as PartyPlayerActor | undefined,
  },
  {
    events: {
      PRESS_CLAIM: () => ({}),
      PRESS_JOIN: () => ({}),
      PRESS_PRIMARY: () => ({}),
    },
  }
);

export const ClubScreenEvents = clubScreenModel.events;

interface CreateMachineProps {
  hostPlayerName: string;
  authActor: AuthActor;
  actorManager: ActorManager;
}

export const createClubScreenMachine = ({
  hostPlayerName,
  authActor,
  actorManager,
}: CreateMachineProps) => {
  const partyActorId = getActorId(ActorType.PARTY_ACTOR, hostPlayerName);

  // What network calls needs to happen?
  // Fetch to see if this profile has been claimed before
  // We can do that with useQuery and firebase I think
  return clubScreenModel.createMachine(
    {
      id: 'ClubScreenMachine',
      initial: 'Loading',
      context: {
        myActor: undefined,
        authActor,
        hostPlayerName,
        actorManager,
        partyActor: undefined,
      },
      states: {
        Loading: {
          invoke: {
            src: () => fetchUserProfileByName(hostPlayerName),
            onDone: 'Connecting',
            onError: 'Unclaimed',
          },
        },
        Unclaimed: {
          initial: 'Indeterminate',
          onDone: 'Connecting',
          states: {
            Indeterminate: {
              invoke: {
                src: 'getHasProfileName',
                onDone: [
                  {
                    target: 'NotExist',
                    cond: (_, event) => !!event.data,
                  },
                  {
                    target: 'Claimable',
                  },
                ],
              },
            },
            NotExist: {},
            Claimable: {
              on: {
                PRESS_CLAIM: 'Claiming',
              },
            },
            Claiming: {
              entry: sendParent(
                NavigationEvents.NAVIGATE_CLAIM_CLUB(hostPlayerName)
              ),
            },
            Claimed: {
              type: 'final' as const,
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
        Error: {},
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
                    // Auto join party if they are hots
                    cond: 'isHost',
                    target: 'Joining',
                  },
                  {
                    target: 'Spectating',
                  },
                ],
              },
            },
            Spectating: {
              entry: 'showJoinButtonInFooter',
              exit: 'hideFooter',
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
              invoke: {
                src: 'createAccount',
                onDone: 'Joining',
                onError: 'CreateError',
              },
            },
            CreateError: {},
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
              invoke: {
                src: enterNameMachine,
                onDone: {
                  target: 'Joined',
                  actions: (
                    { myActor },
                    event: DoneInvokeEvent<{ name: string }>
                  ) => {
                    console.log(event);
                    if (!myActor) {
                      throw new Error('expect myActor when saving name');
                    }

                    myActor.send(
                      PartyPlayerEvents.SET_PLAYER_NAME({
                        playerName: event.data.name,
                      })
                    );
                  },
                },
              },
              on: {
                '': { target: 'Joined', cond: 'hasPlayerName' },
              },
            },
            Rejoining: {
              invoke: {
                src: 'rejoinParty',
                onDone: 'EnteringName',
                onError: 'JoinError',
              },
            },
            JoinError: {},
            Joined: {},
          },
        },
      },
    },
    {
      actions: {
        assignMyActor: clubScreenModel.assign({
          myActor: ({ authActor }) => {
            const userId = authActor.getSnapshot()?.context.session?.user.id;
            if (!userId) {
              throw new Error('trying to assign actor without being logged in');
            }

            const actorId = getActorId(ActorType.PARTY_PLAYER_ACTOR, userId);
            return actorManager.getActor(actorId);
          },
        }),
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

            const actorType = ActorType.TRIVIA_JAM_PLAYER_ACTOR;
            const actorId = getActorId(actorType, userId);
            const playerActor = actorManager.spawn({ actorId, actorType });
            const eventRef = ref(
              db,
              `parties/${hostPlayerName}/actor_events/${actorId}`
            );
            const stateRef = ref(
              db,
              `parties/${hostPlayerName}/actor_state/${actorId}`
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
      },
      guards: {
        hasPlayerName: ({ myActor }) => {
          return !!myActor?.getSnapshot()?.context.playerName;
        },
        isHost: ({ authActor, hostPlayerName }) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const playerName = selectPlayerName(authActor.getSnapshot()!);
          return playerName === hostPlayerName;
        },
        isNotLoggedIn: ({ authActor }) => {
          const session = authActor.getSnapshot()?.context.session;
          return !session;
        },
        isInParty: ({ authActor, actorManager }) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const userId = selectUserId(authActor.getSnapshot()!);
          if (!userId) {
            return false;
          }

          const actorId = getActorId(ActorType.PARTY_PLAYER_ACTOR, userId);
          const partyActor = actorManager.rootActor as PartyActor;

          return partyActor
            .getSnapshot()
            ?.context.playerActorIds.includes(actorId) as boolean;
        },
      },
      services: {
        waitForAuthInit: ({ authActor }) =>
          waitFor(authActor, (state) => !state.matches('Initializing')),
        joinParty: async () => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const userId = selectUserId(authActor.getSnapshot()!);
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
            `parties/${hostPlayerName}/actor_state/${actorId}`
          );
          const myEventRef = ref(
            db,
            `parties/${hostPlayerName}/actor_events/${actorId}`
          );

          const stateJSON = JSON.stringify(myActor.getSnapshot());

          // todo: do in transaction ?
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

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const playerName = selectPlayerName(authActor.getSnapshot()!);
          if (playerName) {
            myActor.send(PartyPlayerEvents.SET_PLAYER_NAME({ playerName }));
          }

          return myActor;
        },
        rejoinParty: async ({ hostPlayerName }) => {
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
            `parties/${hostPlayerName}/actor_events/${actorId}`
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
        connectToParty: async ({ hostPlayerName }) => {
          const stateRef = ref(db, `parties/${hostPlayerName}/actor_state`);
          const eventsRef = ref(db, `parties/${hostPlayerName}/actor_events`);
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

            wirePartyPresence(hostPlayerName);

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
        createAccount: ({ authActor }) => createAnonymousUser(authActor),
        getHasProfileName: async ({ authActor }) => {
          // Wait for the auth actor to finish fetching
          const authState = await waitFor(authActor, selectAuthIsInitalized);
          return !!authState.context.profile?.player_name;
        },
      },
    }
  );
};

/**
 * Add ourselves to `user_party_connections` when we connect
 * and remove when we disconnect. This is how party server
 * knows which parties to spawn.
 */
const wirePartyPresence = (hostPlayerName: string) => {
  const userConnectionsRef = ref(db, 'user_party_connections');

  const connectedRef = ref(db, '.info/connected');
  onValue(connectedRef, (snap) => {
    if (snap.val()) {
      const con = push(userConnectionsRef);
      onDisconnect(con).remove();
      set(con, hostPlayerName);
    }
  });
};

const isPartyActor = (managedActor: ManagedActor) => {
  return managedActor.actorType === 'PARTY_ACTOR';
};

export type ClubScreenMachine = ReturnType<typeof createClubScreenMachine>;
export type ClubScreenActor = ActorRefFrom<ClubScreenMachine>;
export type ClubScreenState = StateFrom<ClubScreenMachine>;
