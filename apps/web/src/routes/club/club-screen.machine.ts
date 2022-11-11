import {
  SharedActorEvent,
  SerializedSharedActor,
  ManagedActor,
  ActorManager,
  ActorType,
  MachineFactory,
  getActorId,
  setActorEvent,
} from '@explorers-club/actor';
import {
  createPartyMachine,
  createPartyPlayerMachine,
  PartyActor,
  PartyPlayerEvents,
} from '@explorers-club/party';
import {
  createTriviaJamMachine,
  createTriviaJamPlayerMachine,
} from '@explorers-club/trivia-jam/state';
import { ref, get, onDisconnect, onValue, push, set } from 'firebase/database';
import { fromRef, ListenEvent } from 'rxfire/database';
import { skipWhile, fromEvent, filter, first, from } from 'rxjs';
import { ActorRefFrom, assign, DoneInvokeEvent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { waitFor } from 'xstate/lib/waitFor';
import { fetchUserProfileByName } from '../../api/fetchUserProfileByName';
import { db } from '../../lib/firebase';
import { supabaseClient } from '../../lib/supabase';
import { AuthActor } from '../../state/auth.machine';
import { selectAuthIsInitalized } from '../../state/auth.selectors';
import { createAnonymousUser } from '../../state/auth.utils';
import { LayoutMeta } from '../layout.types';
import { enterEmailMachine } from './enter-email.machine';
import { enterPasswordMachine } from './enter-password.machine';

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

const clubScreenModel = createModel(
  {
    hostPlayerName: '' as string,
    authActor: {} as AuthActor,
    actorManager: {} as ActorManager,
    partyActor: undefined as PartyActor | undefined,
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
  // What network calls needs to happen?
  // Fetch to see if this profile has been claimed before
  // We can do that with useQuery and firebase I think
  return clubScreenModel.createMachine(
    {
      id: 'ClubScreenMachine',
      initial: 'Loading',
      context: {
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
              initial: 'Initializing',
              onDone: 'Claimed',
              states: {
                Initializing: {
                  always: [
                    { target: 'CreateAccount', cond: 'isNotLoggedIn' },
                    { target: 'EnterEmail', cond: 'isAnonymous' },
                    { target: 'SavePlayerName' },
                  ],
                },
                CreateAccount: {
                  invoke: {
                    src: 'createAccount',
                    onDone: 'EnterEmail',
                    onError: 'Error',
                  },
                },
                EnterEmail: {
                  invoke: {
                    src: enterEmailMachine,
                    onDone: 'EnterPassword',
                    onError: 'Error',
                  },
                },
                EnterPassword: {
                  invoke: {
                    src: enterPasswordMachine,
                    onDone: 'SavePlayerName',
                    onError: 'Error',
                  },
                },
                SavePlayerName: {
                  invoke: {
                    src: 'savePlayerName',
                    onDone: 'Complete',
                    onError: 'Error',
                  },
                },
                Error: {},
                Complete: {
                  type: 'final' as const,
                },
              },
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
                    target: 'Spectating',
                  },
                ],
              },
            },
            Spectating: {
              meta: {
                header: {
                  headerText: 'Welcome to Explorers Club!',
                  subheaderText: 'You are spectating. Tap Join Party to play!',
                },
                footer: {
                  visible: true,
                  primaryLabel: 'Join Party',
                },
              } as LayoutMeta,
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
                  target: 'EnterPlayerName',
                  actions: 'assignMyActor',
                },
                onError: 'JoinError',
              },
            },
            EnterPlayerName: {},
            Rejoining: {
              on: {
                '': { target: 'Joined', actions: 'rejoinParty' },
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
        rejoinParty: ({ hostPlayerName }) => {
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
      },
      guards: {
        isNotLoggedIn: ({ authActor }) => {
          const session = authActor.getSnapshot()?.context.session;
          return !session;
        },
        isClaimable: ({ authActor }) => {
          return false;
        },
        isAnonymous: ({ authActor }) => {
          return !!authActor
            .getSnapshot()
            ?.context.session?.user.email?.match('@anon-users.explorers.club');
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
        savePlayerName: async (context) => {
          const userId = authActor.getSnapshot()?.context.session?.user.id;
          if (!userId) {
            throw new Error(
              'tried to save player name without being logged in'
            );
          }

          const playerName = context.hostPlayerName;

          const { error } = await supabaseClient
            .from('profiles')
            .update({ player_name: playerName })
            .eq('user_id', userId);

          if (error) {
            throw error;
          }

          return true;
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
