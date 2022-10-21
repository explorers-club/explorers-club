import {
  ActorManager,
  initializeActor,
  MachineFactory,
  ManagedActor,
  setActorEvent,
  setActorState,
  setNewActor,
  SharedActorRef
} from '@explorers-club/actor';
import {
  createPartyMachine,
  createPartyPlayerMachine,
  getPartyActorId,
  getPartyPlayerActorId,
  PartyActor,
  PartyPlayerEvents
} from '@explorers-club/party';
import {
  DataSnapshot,
  onChildAdded,
  onDisconnect,
  onValue,
  push,
  ref,
  set
} from 'firebase/database';
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
  const actorsRef = ref(db, `parties/${joinCode}/actor_list`);

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
        isInParty: ({ authActor, actorManager }) => {
          const userId = authActor.getSnapshot()?.context.session?.user.id; // lol
          if (!userId) {
            return false;
          }

          const actorId = getPartyPlayerActorId(userId);
          const partyActor = actorManager.rootActor as PartyActor;
          console.log(partyActor.getSnapshot()?.context);
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

          // TODO dry up this code with party-server
          const myActor = actorManager.spawn(sharedActorRef);
          actorManager.myActorId = actorId;
          const stateRef = ref(
            db,
            `parties/${joinCode}/actors/${actorId}/state`
          );
          const stateJSON = JSON.stringify(myActor.getSnapshot());
          await setActorState(stateRef, stateJSON);

          const actorsRef = ref(db, `parties/${joinCode}/actor_list`);
          const newActorRef = push(actorsRef);
          await setNewActor(newActorRef, sharedActorRef);

          const eventRef = ref(
            db,
            `parties/${joinCode}/actors/${actorId}/event`
          );

          // Send disconnect event when we disconnect
          onDisconnect(eventRef).set(PartyPlayerEvents.DISCONNECT());

          myActor.onEvent(async (event) => {
            await setActorEvent(eventRef, event);
          });
        },
        connectToParty: async (context, event) => {
          return new Promise((resolve, reject) => {
            // TODO use rxjs here for consistency with server code
            // Get all actors and initialize them
            onChildAdded(actorsRef, (snap: DataSnapshot) => {
              const ref = snap.val() as SharedActorRef;
              initializeActor(db, joinCode, ref, actorManager);
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
