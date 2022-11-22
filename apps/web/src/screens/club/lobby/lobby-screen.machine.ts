import {
  ActorType,
  createActorByIdSelector,
  CreateMachineFunction,
  createSharedCollectionMachine,
  getActorId,
  SharedCollectionActor,
} from '@explorers-club/actor';
import {
  createLobbyPlayerMachine,
  createLobbyServerMachine,
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
import { AuthActor } from '../../../state/auth.machine';
import {
  Database,
  onDisconnect,
  onValue,
  push,
  ref,
  set,
} from 'firebase/database';
import { ActorRefFrom, createMachine, StateFrom, interpret } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { ModelContextFrom, ModelEventsFrom } from 'xstate/lib/model.types';
import { waitFor } from 'xstate/lib/waitFor';
import { createSelector } from 'reselect';
import {
  selectAuthIsInitalized,
  selectUser,
  selectUserId,
} from '../../../state/auth.selectors';
import { createAnonymousUser } from '../../../state/auth.utils';

const lobbyScreenModel = createModel(
  {
    sharedCollectionActor: {} as SharedCollectionActor,
  },
  {
    events: {
      PRESS_JOIN: () => ({}),
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
          initial: 'Initializing',
          states: {
            Initializing: {
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
            Rejoining: {},
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
            Joining: {},
          },
        },
      },
      predictableActionArguments: true,
    },
    {
      guards: {
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

          const actorId = getActorId(ActorType.LOBBY_PLAYER_ACTOR, userId);
          const selectActor = createActorByIdSelector(actorId);

          const lobbyPlayerActor = selectActor(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            sharedCollectionActor.getSnapshot()!
          );
          return !!lobbyPlayerActor;
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
        // initializeActors: (_, event) => {
        //   assertEventType(
        //     event,
        //     'done.invoke.LobbyScreenMachine.Fetching:invocation[0]'
        //   );
        //   event.data.stateJSON
        //   return;
        // },
      },
      services: {
        createAccount: () => {
          return createAnonymousUser(authActor);
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
