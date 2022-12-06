import {
  ActorType,
  createActorByIdSelector,
  CreateMachineFunction,
  createSharedCollectionMachine,
  getActorId,
  selectActorRefs,
  selectActorsInitialized,
  SharedCollectionEvents,
} from '@explorers-club/actor';
import {
  createLobbyPlayerMachine,
  createLobbyServerMachine,
  createLobbySharedMachine,
} from '@explorers-club/lobby';
import {
  createPartyMachine,
  createPartyPlayerMachine,
} from '@explorers-club/party';
import {
  createTriviaJamMachine,
  createTriviaJamPlayerMachine,
} from '@explorers-club/trivia-jam/state';
import { generateUUID, noop } from '@explorers-club/utils';
import {
  onChildAdded,
  onDisconnect,
  ref,
  runTransaction,
  set,
} from 'firebase/database';
import { BehaviorSubject, filter, from } from 'rxjs';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import { db } from './lib/firebase';

const serverInstanceId = generateUUID();
const runningLobbies = new Set();

async function bootstrap() {
  // todo generalize this to work for 'lobby' and 'game' root paths and actor types
  const initializeLobby = async (hostPlayerName: string) => {
    const localActorId$ = new BehaviorSubject(
      getActorId(ActorType.LOBBY_SHARED_ACTOR, hostPlayerName)
    );
    const rootPath = `lobby/${hostPlayerName}`;

    console.log('running', hostPlayerName);
    const sharedCollectionMachine = createSharedCollectionMachine({
      db,
      rootPath,
      localActorId$,
      getCreateMachine,
    });

    // Run the shared actor service, which fetches and manages all the actors locally
    const sharedCollectionActor = interpret(sharedCollectionMachine).start();

    const sharedActorId = getActorId(
      ActorType.LOBBY_SHARED_ACTOR,
      hostPlayerName
    );

    // Wait for actors to be loaded
    await waitFor(sharedCollectionActor, selectActorsInitialized);

    // Spawn the shared actor if we don't have one yet
    const selectSharedActor = createActorByIdSelector(sharedActorId);
    const sharedActor = selectSharedActor(sharedCollectionActor.getSnapshot());
    if (!sharedActor) {
      sharedCollectionActor.send(SharedCollectionEvents.SPAWN(sharedActorId));
    }

    const lobbyServerMachine = createLobbyServerMachine({
      sharedCollectionActor,
      sharedActorId,
    });
    interpret(lobbyServerMachine).start(); // todo persist state/resume server state

    // After we process an event, save the updated state
    from(sharedCollectionActor)
      .pipe(filter((state) => state.event.type === 'SEND_EVENT'))
      .subscribe(({ event }) => {
        const { actorId } = event;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const actorRefs = selectActorRefs(sharedCollectionActor.getSnapshot()!);
        const actor = actorRefs[actorId];
        if (!actor) {
          console.error(
            'unexpected to find actor when trying to save actor state'
          );
          return;
        }
        const actorStateRef = ref(db, `${rootPath}/actor_state/${actorId}`);

        const state = actor.getSnapshot();
        const stateJSON = JSON.stringify(state);
        // console.log(state, stateJSON, event);

        set(actorStateRef, stateJSON).then(noop); // todo handle error
      });
  };

  const trySpawnLobbyServer = async (hostPlayerName: string) => {
    if (runningLobbies.has(hostPlayerName)) {
      return;
    }

    const serverInstanceRef = ref(
      db,
      `lobby/${hostPlayerName}/server_instance`
    );
    await runTransaction(serverInstanceRef, (currentServerInstance) => {
      // todo, theres an issue around currentHostId being unexpectedly null
      if (currentServerInstance) {
        return currentServerInstance;
      }

      initializeLobby(hostPlayerName);
      runningLobbies.add(hostPlayerName);

      onDisconnect(serverInstanceRef).remove();
      return serverInstanceId;
    });
  };

  const lobbyConnectionsRef = ref(db, 'lobby_connections');
  onChildAdded(lobbyConnectionsRef, (data) => {
    const joinCode = data.val();
    trySpawnLobbyServer(joinCode);
  });
}

bootstrap();

// interpret(lobbyServerMachine).start();

// MachineFactory.registerMachine(ActorType.PARTY_ACTOR, createPartyMachine);
// MachineFactory.registerMachine(
//   ActorType.PARTY_PLAYER_ACTOR,
//   createPartyPlayerMachine
// );
// MachineFactory.registerMachine(
//   ActorType.TRIVIA_JAM_ACTOR,
//   createTriviaJamMachine
// );
// MachineFactory.registerMachine(
//   ActorType.TRIVIA_JAM_PLAYER_ACTOR,
//   createTriviaJamPlayerMachine
// );

// async function bootstrap() {
// }

// async function bootstrap() {
//   const hostId = generateUUID();

//   const trySpawnPartyHost = async (joinCode: string) => {
//     if (runningParties.has(joinCode)) {
//       return;
//     }

//     const hostRef = ref(db, `parties/${joinCode}/host`);
//     await runTransaction(hostRef, (currentHostId) => {
//       // todo, theres an issue around currentHostId being unexpectedly null
//       if (currentHostId) {
//         return currentHostId;
//       }

//       initializeParty(joinCode);
//       runningParties.add(joinCode);

//       onDisconnect(hostRef).remove();
//       return hostId;
//     });
//   };

//   const initializeParty = async (joinCode: string) => {
//     console.debug('hosting ' + joinCode);
//     const partyActorId = getActorId(ActorType.PARTY_ACTOR, joinCode);
//     const actorManager = new ActorManager(partyActorId);
//     const stateRef = ref(db, `parties/${joinCode}/actor_state`);
//     const eventsRef = ref(db, `parties/${joinCode}/actor_events`);

//     const myEventRef = ref(
//       db,
//       `parties/${joinCode}/actor_events/${partyActorId}`
//     );
//     const myStateRef = ref(
//       db,
//       `parties/${joinCode}/actor_state/${partyActorId}`
//     );
//     let initialized = false;

//     // Listen for any changes to the events ref
//     const newEvent$ = fromRef(eventsRef, ListenEvent.changed);

//     newEvent$.subscribe(async (changes) => {
//       const { actorId, event } = changes.snapshot.val() as SharedActorEvent; // way to make this safer?
//       const actor = actorManager.getActor(actorId);
//       if (!actor) {
//         console.warn("Couldn't find actor " + actorId);
//         return;
//       }

//       // Don't process events sent from the host actor
//       if (actorId !== partyActorId) {
//         actor.send(event);
//       }

//       // Persist updated state in db
//       const actorStateRef = ref(
//         db,
//         `parties/${joinCode}/actor_state/${actorId}`
//       );
//       await setActorState(actorStateRef, actorManager.serialize(actorId));
//     });

//     // Listen for new actors and hydrate them
//     const actorAdded$ = fromRef(stateRef, ListenEvent.added).pipe(
//       skipWhile(() => !initialized),
//       map((change) => change.snapshot.val() as SerializedSharedActor)
//     );
//     actorAdded$.subscribe((serializedActor: SerializedSharedActor) => {
//       // console.log('actor ADDED', serializedActor);
//       actorManager.hydrate(serializedActor);

//       if (serializedActor.actorType === ActorType.PARTY_PLAYER_ACTOR) {
//         partyActor.send(
//           PartyEvents.PLAYER_JOINED({ actorId: serializedActor.actorId })
//         );
//       }
//     });

//     // Remove players from party if they have disconnected after 30 seconds
//     // todo: only do this if they are still in the lobby
//     const playerDisconnect$ = fromActorEvents(actorManager, [
//       'PLAYER_DISCONNECT',
//     ]);
//     const DISCONNECT_REMOVAL_TIMEOUT_MS = 30000;
//     playerDisconnect$
//       .pipe(
//         skipWhile(() => {
//           // Only remove players while in lobby, never remove a player while in game.
//           return !partyActor.getSnapshot().matches('Lobby');
//         })
//       )
//       .subscribe(({ actorId }) => {
//         const actor = actorManager.getActor(actorId);
//         const timer = setTimeout(() => {
//           partyActor.send(PartyEvents.PLAYER_LEFT({ actorId }));
//         }, DISCONNECT_REMOVAL_TIMEOUT_MS);

//         const cancelRemoval = (e) => {
//           if (e.type === 'PLAYER_DISCONNECT') {
//             return;
//           }
//           clearTimeout(timer);
//           actor.off(cancelRemoval);
//         };
//         actor.onEvent(cancelRemoval);
//       });

//     // Get initial state and hydrate it
//     const stateSnapshot = await get(stateRef);
//     const stateMap = (stateSnapshot.val() || {}) as Record<
//       string,
//       SerializedSharedActor
//     >;
//     const serializedActors = Object.values(stateMap);
//     actorManager.hydrateAll(serializedActors);

//     // If there is no party actor present, spawn one
//     let partyActor = actorManager.rootActor;
//     if (!partyActor) {
//       partyActor = actorManager.spawn({
//         actorId: partyActorId,
//         actorType: ActorType.PARTY_ACTOR,
//       });

//       // do these together in same transaction?
//       await setActorState(myStateRef, actorManager.serialize(partyActorId));
//       await setActorEvent(myEventRef, {
//         actorId: partyActorId,
//         event: { type: 'INIT' },
//       });
//     }

//     // Log our events to the database
//     partyActor.onEvent(async (e) => {
//       // convert to json first because invoke events have
//       // a toString() function on them that we cant set in db
//       const event = JSON.parse(JSON.stringify(e));
//       await setActorEvent(myEventRef, { actorId: partyActorId, event });
//     });

//     wirePartyServer(partyActor, actorManager, joinCode);

//     initialized = true;
//   };

//   const userConnectionsRef = ref(db, 'user_party_connections');
//   onChildAdded(userConnectionsRef, (data) => {
//     const joinCode = data.val();
//     trySpawnPartyHost(joinCode);
//   });
// }

// /**
//  * Calling it wiring because here we are generically listening for
//  * events by setting up observables on the actors, running operators
//  * on those observables, and then running functions to execute business
//  * logic for different scnearios.
//  *
//  * Here we are first wiring up the party actor to spawn the game actor
//  * after all players have readied up and the lobby is transitioning state.
//  *
//  * Plan to re-use / encapsulate this pattern in an interface for writing
//  * business logic in response to events that happen in the world.
//  * Devs should be able to compose sets of these together to form their game.
//  *
//  * To think more about the interface / names
//  */
// function wirePartyServer(
//   partyActor: PartyActor,
//   actorManager: ActorManager,
//   joinCode: string
// ) {
//   /**
//    * Spawns the actor on the actor manager and initializes actor in the db.
//    */
//   const spawnGameActor = async () => {
//     const actorType = ActorType.TRIVIA_JAM_ACTOR;
//     const actorId = getActorId(actorType, joinCode);
//     const eventRef = ref(db, `parties/${joinCode}/actor_events/${actorId}`);
//     const stateRef = ref(db, `parties/${joinCode}/actor_state/${actorId}`);
//     const actor = actorManager.spawn({ actorId, actorType });

//     const { hostActorId, playerActorIds } = partyActor.getSnapshot().context;
//     const partyPlayerActors = playerActorIds.map(
//       (actorId) => actorManager.getActor(actorId) as PartyPlayerActor
//     );
//     const userIds = partyPlayerActors.map(
//       (actor) => actor.getSnapshot().context.userId
//     );
//     const gamePlayerActorIds = userIds.map((userId) =>
//       getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, userId)
//     );

//     const hostUserId = actorManager.getActor(hostActorId).getSnapshot()
//       .context.userId;
//     const hostId = getActorId(ActorType.TRIVIA_JAM_PLAYER_ACTOR, hostUserId);

//     TriviaJamEvents.INITIALIZE({
//       playerActorIds: gamePlayerActorIds,
//       hostId,
//     });

//     await setActorState(stateRef, actorManager.serialize(actorId));
//     await setActorEvent(eventRef, {
//       actorId,
//       event: { type: 'INIT' },
//     });

//     actor.onEvent(async (e) => {
//       // convert to json first because invoke events have
//       // a toString() function on them that we cant set in db
//       const event = JSON.parse(JSON.stringify(e));
//       await setActorEvent(eventRef, { actorId, event });
//     });

//     console.log('spawned game actor!', actorId);
//   };

//   // When party machine enters Game state, spawn the game actor
//   const state$ = from(partyActor);
//   const enterGame$ = state$.pipe(
//     filter((state) => state.matches('Lobby.CreatingGame'))
//   );
//   enterGame$.subscribe(spawnGameActor);
// }

// bootstrap();

// TODO dry up with client
const getCreateMachine: (actorType: ActorType) => CreateMachineFunction = (
  actorType: ActorType
) => {
  switch (actorType) {
    case ActorType.LOBBY_PLAYER_ACTOR:
      return createLobbyPlayerMachine;
    case ActorType.LOBBY_SHARED_ACTOR:
      return createLobbySharedMachine;
    case ActorType.PARTY_ACTOR:
      return createPartyMachine;
    case ActorType.PARTY_PLAYER_ACTOR:
      return createPartyPlayerMachine;
    case ActorType.TRIVIA_JAM_SHARED_ACTOR:
      return createTriviaJamMachine;
    case ActorType.TRIVIA_JAM_PLAYER_ACTOR:
      return createTriviaJamPlayerMachine;
  }
};

// const setupBroadcastListeners = (
//   rootPath: string,
//   actor: SharedCollectionActor
// ) => {
//   rootPath
// };
