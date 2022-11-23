import {
  ActorType,
  createActorByIdSelector,
  CreateMachineFunction,
  createSharedCollectionMachine,
  getActorId,
  SharedCollectionActor,
  SharedCollectionEvents,
} from '@explorers-club/actor';
import {
  createLobbyPlayerMachine,
  createLobbyServerMachine,
  createPlayerActorByUserIdSelector,
  selectLobbyPlayerName,
  selectLobbyServerActor,
} from '@explorers-club/lobby';
import {
  createPartyMachine,
  createPartyPlayerMachine,
} from '@explorers-club/party';
import {
  createTriviaJamMachine,
  createTriviaJamPlayerMachine,
} from '@explorers-club/trivia-jam/state';
import {
  Database,
  onDisconnect,
  onValue,
  push,
  ref,
  set,
} from 'firebase/database';
import { createSelector } from 'reselect';
import {
  ActorRefFrom,
  createMachine,
  DoneInvokeEvent,
  interpret,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { ModelContextFrom, ModelEventsFrom } from 'xstate/lib/model.types';
import { waitFor } from 'xstate/lib/waitFor';
import { AuthActor } from '../../../state/auth.machine';
import {
  selectAuthIsInitalized,
  selectUser,
  selectUserId,
} from '../../../state/auth.selectors';
import { createAnonymousUser } from '../../../state/auth.utils';
import { enterNameMachine } from '@organisms/enter-name-form';

const lobbyScreenModel = createModel(
  {
    sharedCollectionActor: {} as SharedCollectionActor,
  },
  {
    events: {
      PRESS_JOIN: () => ({}),
      PRESS_READY: () => ({}),
      PRESS_UNREADY: () => ({}),
    },
  }
);

export const LobbyScreenEvents = lobbyScreenModel.events;

// TODO better way to set up this type to be inferrable
// type LobbyScreenServices = {
//   fetchAllActors: {
//     data: {
//       stateJSON?: string;
//     };
//   };
// };

type LobbyScreenUserEvent = ModelEventsFrom<typeof lobbyScreenModel>;
type LobbyScreenInvokeEvent = {
  type: 'done.invoke.LobbyScreenMachine.Fetching:invocation[0]';
  data: {
    stateJSON: string;
  };
};

type LobbyScreenEvent = LobbyScreenUserEvent | LobbyScreenInvokeEvent;

type LobbyScreenContext = ModelContextFrom<typeof lobbyScreenModel>;

interface CreateProps {
  db: Database;
  hostPlayerName: string;
  authActor: AuthActor;
}

export const createLobbyScreenMachine = ({
  hostPlayerName,
  db,
  authActor,
}: CreateProps) => {
  const sharedCollectionMachine = createSharedCollectionMachine({
    db,
    rootPath: `lobby/${hostPlayerName}`,
    getCreateMachine,
  });
  const sharedCollectionActor = interpret(sharedCollectionMachine).start();

  return createMachine<
    LobbyScreenContext,
    LobbyScreenEvent
    // Typestate<LobbyScreenContext>,
    // LobbyScreenServices
  >(
    {
      id: 'LobbyScreenMachine',
      // ALgorithm
      // 1. spawn the shared collection machine
      // 2. wait for it to initialize
      // 3. assign it as a ref
      // 4. transition
      initial: 'Loading',
      context: {
        sharedCollectionActor,
      },
      states: {
        Loading: {
          entry: 'initializePresence',
          invoke: {
            src: 'waitForServerActor',
            onDone: 'Connected',
          },
        },
        Connected: {
          initial: 'Loading',
          states: {
            Loading: {
              invoke: {
                src: 'waitForAuthInit',
                onDone: [
                  {
                    // Resume playing if they were previously connected
                    cond: 'isInParty',
                    target: 'Rejoining',
                  },
                  {
                    target: 'Spectating',
                  },
                ],
              },
            },
            Rejoining: {
              invoke: {
                src: 'waitForMyPlayerActor',
                onDone: 'Joined',
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
              invoke: {
                src: 'createAccount',
                onDone: 'Joining',
              },
            },
            Joining: {
              entry: 'spawnPlayerActor',
              invoke: {
                src: 'waitForMyPlayerActor',
                onDone: 'Joined',
              },
            },
            Joined: {
              initial: 'Initializing',
              states: {
                Initializing: {
                  on: {
                    '': [
                      { target: 'Waiting', cond: 'hasPlayerName' },
                      { target: 'EnteringName' },
                    ],
                  },
                },
                EnteringName: {
                  invoke: {
                    src: enterNameMachine,
                    onDone: {
                      target: 'Waiting',
                      actions: (
                        _,
                        event: DoneInvokeEvent<{ name: string }>
                      ) => {
                        console.log(event.data.name);
                      },
                    },
                  },
                },
                Waiting: {},
              },
            },
          },
        },
      },
      predictableActionArguments: true,
    },
    {
      guards: {
        hasPlayerName: () => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const userId = selectUserId(authActor.getSnapshot()!);
          if (!userId) {
            return false;
          }

          const selectMyPlayerActor = createPlayerActorByUserIdSelector(userId);
          const myActor = selectMyPlayerActor(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            sharedCollectionActor.getSnapshot()!
          );

          if (!myActor) {
            return false;
          }

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const playerName = selectLobbyPlayerName(myActor.getSnapshot()!);
          return !!playerName;
        },
        isNotLoggedIn: () => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return !selectUser(authActor.getSnapshot()!);
        },
        isInParty: ({ sharedCollectionActor }) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const userId = selectUserId(authActor.getSnapshot()!);
          if (!userId) {
            return false;
          }

          const selectMyPlayerActor = createPlayerActorByUserIdSelector(userId);
          const myActor = selectMyPlayerActor(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            sharedCollectionActor.getSnapshot()!
          );
          return !!myActor;
        },
      },
      actions: {
        initializePresence: () => {
          const lobbyConnectionsRef = ref(db, 'lobby_connections');

          const connectedRef = ref(db, '.info/connected');
          onValue(connectedRef, (snap) => {
            if (snap.val()) {
              const con = push(lobbyConnectionsRef);
              onDisconnect(con).remove();
              set(con, hostPlayerName);
            }
          });
        },
        spawnPlayerActor: ({ sharedCollectionActor }) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const userId = selectUserId(authActor.getSnapshot()!);
          if (!userId) {
            throw new Error('expected user id');
          }

          const actorId = getActorId(ActorType.LOBBY_PLAYER_ACTOR, userId);
          sharedCollectionActor.send(SharedCollectionEvents.SPAWN(actorId));
        },
      },
      services: {
        createAccount: () => {
          return createAnonymousUser(authActor);
        },
        waitForMyPlayerActor: async () => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const userId = selectUserId(authActor.getSnapshot()!);
          if (!userId) {
            throw new Error('expected user id');
          }

          const actorId = getActorId(ActorType.LOBBY_PLAYER_ACTOR, userId);
          const selectMyPlayerActor = createActorByIdSelector(actorId);
          const selectMyPlayerActorIsLoaded = createSelector(
            selectMyPlayerActor,
            (actor) => !!actor
          );

          console.log('waiting', sharedCollectionActor.getSnapshot());
          await waitFor(sharedCollectionActor, selectMyPlayerActorIsLoaded);
          console.log('done waiting', sharedCollectionActor.getSnapshot());
        },
        waitForAuthInit: async () => {
          await waitFor(authActor, selectAuthIsInitalized);
        },
        waitForServerActor: async ({ sharedCollectionActor }) => {
          const selectServerActorIsLoaded = createSelector(
            selectLobbyServerActor,
            (actor) => !!actor
          );
          await waitFor(sharedCollectionActor, selectServerActorIsLoaded);
        },
        // fetchAllActors: async (_, event) => {
        //   return [] as string[];
        // },
        // fetchActorState: async () => {
        //   return undefined;
        // },
      },
    }
  );
};

export type LobbyScreenMachine = ReturnType<typeof createLobbyScreenMachine>;
export type LobbyScreenActor = ActorRefFrom<LobbyScreenMachine>;
export type LobbyScreenState = StateFrom<LobbyScreenMachine>;

// TODO dry up with server
const getCreateMachine: (actorType: ActorType) => CreateMachineFunction = (
  actorType: ActorType
) => {
  switch (actorType) {
    case ActorType.LOBBY_PLAYER_ACTOR:
      return createLobbyPlayerMachine;
    case ActorType.LOBBY_SERVER_ACTOR:
      return createLobbyServerMachine;
    case ActorType.PARTY_ACTOR:
      return createPartyMachine;
    case ActorType.PARTY_PLAYER_ACTOR:
      return createPartyPlayerMachine;
    case ActorType.TRIVIA_JAM_ACTOR:
      return createTriviaJamMachine;
    case ActorType.TRIVIA_JAM_PLAYER_ACTOR:
      return createTriviaJamPlayerMachine;
  }
};
