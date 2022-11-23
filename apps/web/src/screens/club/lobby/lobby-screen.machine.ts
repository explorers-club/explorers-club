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
  LobbyPlayerEvents,
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
  AnyEventObject,
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
import { BehaviorSubject, from, map } from 'rxjs';
import { assign } from 'lodash';

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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userId = selectUserId(authActor.getSnapshot()!);
  const initialActorId = userId
    ? getActorId(ActorType.LOBBY_PLAYER_ACTOR, userId)
    : undefined;
  const localActorId$ = new BehaviorSubject(initialActorId);
  // todo? apply generic to convert obs -> behavior subjects https://stackoverflow.com/a/54352114
  from(authActor)
    .pipe(
      map(selectUserId),
      map(
        (userId) => userId && getActorId(ActorType.LOBBY_PLAYER_ACTOR, userId)
      )
    )
    .subscribe(localActorId$);

  // const localActorId$ = from(authActor).pipe(
  // map(selectUserId),
  // map((userId) => {
  //   if (userId) {
  //     return getActorId(ActorType.LOBBY_PLAYER_ACTOR, userId);
  //   }
  //   return undefined;
  // })
  // );

  const sharedCollectionMachine = createSharedCollectionMachine({
    db,
    localActorId$,
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
                        { sharedCollectionActor },
                        event: DoneInvokeEvent<{ name: string }>
                      ) => {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        const userId = selectUserId(authActor.getSnapshot()!);
                        if (!userId) {
                          throw new Error('expected user id');
                        }

                        const selectMyPlayerActor =
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          createPlayerActorByUserIdSelector(userId!);

                        const myPlayerActor = selectMyPlayerActor(
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          sharedCollectionActor.getSnapshot()!
                        );
                        myPlayerActor?.send(
                          LobbyPlayerEvents.PLAYER_SET_NAME(event.data.name)
                        );
                      },
                    },
                  },
                },
                Waiting: {
                  on: {
                    PRESS_READY: {
                      actions: 'sendReadyEvent',
                    },
                    PRESS_UNREADY: {
                      actions: 'sendUnreadyEvent',
                    },
                  },
                },
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
        sendReadyEvent: ({ sharedCollectionActor }) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const userId = selectUserId(authActor.getSnapshot()!);
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const selectMyPlayerActor = createPlayerActorByUserIdSelector(
            userId!
          );
          const myActor = selectMyPlayerActor(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            sharedCollectionActor.getSnapshot()!
          );

          myActor?.send(LobbyPlayerEvents.PLAYER_READY());
        },
        sendUnreadyEvent: ({ sharedCollectionActor }) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const userId = selectUserId(authActor.getSnapshot()!);
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const selectMyPlayerActor = createPlayerActorByUserIdSelector(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            userId!
          );
          const myActor = selectMyPlayerActor(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            sharedCollectionActor.getSnapshot()!
          );

          myActor?.send(LobbyPlayerEvents.PLAYER_UNREADY());
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

          await waitFor(sharedCollectionActor, selectMyPlayerActorIsLoaded);
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
