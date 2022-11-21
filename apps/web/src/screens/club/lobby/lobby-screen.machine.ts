import {
  ActorType,
  CreateMachineFunction,
  createSharedCollectionMachine,
} from '@explorers-club/actor';
import {
  createLobbyPlayerMachine,
  createLobbyServerMachine,
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
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { ModelContextFrom, ModelEventsFrom } from 'xstate/lib/model.types';

const lobbyScreenModel = createModel(
  {},
  {
    events: {
      CONNECT: () => ({}),
      JOIN_PARTY: (userId: string) => ({ userId }),
    },
  }
);

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
  userId?: string;
}

export const createLobbyScreenMachine = ({
  hostPlayerName,
  db,
  userId,
}: CreateProps) => {
  const sharedCollectionMachine = createSharedCollectionMachine({
    db,
    rootPath: `lobby/${hostPlayerName}`,
    getCreateMachine,
  });

  return createMachine<
    LobbyScreenContext,
    LobbyScreenEvent
    // Typestate<LobbyScreenContext>,
    // LobbyScreenServices
  >(
    {
      id: 'LobbyScreenMachine',
      initial: 'Running',
      states: {
        Running: {
          entry: 'connectPresence',
          invoke: {
            src: sharedCollectionMachine,
          },
        },
      },
      predictableActionArguments: true,
    },
    {
      actions: {
        connectPresence: () => {
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
