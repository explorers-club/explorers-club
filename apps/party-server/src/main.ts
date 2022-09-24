import {
  ActorEvents,
  ActorManager,
  MachineFactory,
  SerializedSharedActor,
} from '@explorers-club/actor';
import {
  createPartyMachine,
  createPartyPlayerMachine,
  getPartyActorId,
} from '@explorers-club/party';
import { noop } from '@explorers-club/utils';
import * as crypto from 'crypto';
import {
  onChildAdded,
  onDisconnect,
  onValue,
  push,
  ref,
  runTransaction,
  set,
} from 'firebase/database';
import { db } from './lib/firebase';

// Presence app example
// https://firebase.google.com/docs/database/android/offline-capabilities#section-sample

// type PartyRow = Database['public']['Tables']['parties']['Row'];
MachineFactory.registerMachine('PARTY_ACTOR', createPartyMachine);
MachineFactory.registerMachine('PLAYER_ACTOR', createPartyPlayerMachine);

async function bootstrap() {
  const hostId = crypto.randomUUID();

  const trySpawnPartyHost = async (joinCode: string) => {
    const hostRef = ref(db, `parties/${joinCode}/host`);
    // todo: only do the transaction if we're unsure if the party is already running locally
    const isHost = !!runTransaction(hostRef, (currentHostId) => {
      // If a host is already set, bail
      if (currentHostId) {
        return undefined;
      }

      onDisconnect(hostRef).remove();
      return hostId;
    });

    if (!isHost) {
      return;
    }

    const partyActorId = getPartyActorId(joinCode);
    const actorManager = new ActorManager(partyActorId);

    console.debug('hosting ' + partyActorId);

    const actorsRef = ref(db, `parties/${joinCode}/actors`);
    const eventsRef = ref(db, `parties/${joinCode}/events`);

    // Immediately spawn the main party actor...
    onValue(
      actorsRef,
      (snap) => {
        const actorData = (snap.val() || []) as SerializedSharedActor[];
        actorManager.hydrateAll(actorData);

        const actorId = partyActorId;
        const actorType = 'PARTY_ACTOR';

        // If a root actor hasn't been spawned yet for the party,
        // then spawn one
        if (!actorManager.rootActor) {
          const rootActor = actorManager.spawn({
            actorId,
            actorType,
          });

          const newEventRef = push(eventsRef);
          console.log('spawning');
          set(
            newEventRef,
            ActorEvents.SPAWN({
              actorId,
              actorType,
              actor: rootActor,
            })
          ).then((f) => {
            console.log('spawned ' + actorId);
          });
        }

        // How does this go over the network now?

        runPartyLoop(joinCode, actorManager);
      },
      {
        onlyOnce: true,
      }
    );
  };

  const userConnectionsRef = ref(db, 'user_party_connections');
  onChildAdded(userConnectionsRef, (data) => {
    console.log('user connections add');
    const joinCode = data.val();
    trySpawnPartyHost(joinCode);
  });

  // const userId = 'foo';

  // // Since I can connect from multiple devices or browser tabs, we store each connection instance separately
  // // any time that connectionsRef's value is null (i.e. has no children) I am offline
  // const lastOnlineRef = ref(db, `users/${userId}/lastOnline`);
  // const myConnectionsRef = ref(db, `users/${userId}/connections`);
  // const connectedRef = ref(db, '.info/connected');
  // onValue(connectedRef, (snap) => {
  //   if (snap.val()) {
  //     // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
  //     const con = push(myConnectionsRef);
  //     // When I disconnect, remove this device
  //     onDisconnect(con).remove();

  //     set(con, true);

  //     onDisconnect(lastOnlineRef).set(serverTimestamp());
  //   }
  // });
}

bootstrap();

/**
 * Runs the logic for the party in a loop.
 * @param joinCode
 * @param actorManager
 */
const runPartyLoop = async (joinCode: string, actorManager: ActorManager) => {
  const actorsRef = ref(db, `parties/${joinCode}/actors`);

  // actorManager.rootActor.subscribe((e) => {
  //   console.log('root actor event', e);
  // });

  const loop = () => {
    // Backup current state
    const actorsJSON = actorManager.serializeAll();
    set(actorsRef, actorsJSON).then(noop);
    setTimeout(loop, 500);
  };

  loop();
};

/**
 * Bootstraps the party server by setting up a listener for new
 * parties, and another listener to poll for parties that need
 * an active host (in case of crash/disconnect).
 *
 * Each party server instance will try to "acquire the lock" for
 * the party from redis before starting to run the party/game
 * server code.
 */
// async function bootstrap() {
//   const hostId = crypto.randomUUID();

//   const trySpawnPartyHost = async (joinCode: string) => {
//     console.debug('trying to spawn ' + joinCode);
//     const partyChannel = supabaseAdmin.channel(`party-${joinCode}`);
//     partyChannel.subscribe((status) => console.log(status));

//     const partyActorId = getPartyActorId(joinCode);
//     const actorManager = new ActorManager(partyChannel, partyActorId);

//     try {
//       let lock = await redlock.acquire([partyActorId], 5000);

//       console.debug('trying to spawn ' + joinCode);

//       if (lock) {
//         // Check to see if we are resuming by grabbing state from redis
//         // Then hydrate the actor manager with that state
//         const sharedActorJSON = await redisClient.get(`party:${joinCode}`);
//         if (sharedActorJSON) {
//           const sharedActors = JSON.parse(sharedActorJSON);
//           console.debug(
//             'Resuming from previous state',
//             partyActorId,
//             sharedActors
//           );
//           actorManager.hydrateAll(sharedActors);
//         } else {
//           // Otherwise spawn a new root actor
//           actorManager.spawn({
//             actorId: partyActorId,
//             actorType: 'PARTY_ACTOR',
//           });
//         }
//         // TODO next partyActor is null
//         const partyActor = actorManager.rootActor as PartyActor;

//         initializePresence({ channel: partyChannel, actorManager, partyActor });

//         // Try to acquire the lock continuously (TODO figure out a done state)
//         while (lock) {
//           console.log('heartbeat ' + joinCode);
//           lock = await lock.extend(5000);

//           // Persist current state to cache every few seconds
//           const sharedActors = actorManager.serializeAll();
//           redisClient
//             .set(
//               `party:${joinCode}`,
//               JSON.stringify(sharedActors),
//               'EX',
//               60 * 60 * 24 /* expires in 1 day */
//             )
//             .then(noop)
//             .catch(console.error);

//           // Set host for this party, expire it in ~7 seconds
//           // so a new host can be re-spawned if timed out
//           redisClient
//             .set(`party:${joinCode}:host`, hostId, 'EX', 7)
//             .then(noop)
//             .catch(console.error);
//           await sleep(4500);
//         }
//       }
//     } catch (ex) {
//       console.warn(`lost lock on ${partyActorId}`);
//     }
//   };

//   const handleUsersSync = async () => {
//     const presenceState = usersChannel.presenceState();
//     console.log({ presenceState });
//     const allParties = Object.values(presenceState)
//       .map((p) => p[0]['party'] as string)
//       .filter((party) => !!party);
//     const parties = [...new Set(allParties)];

//     // TODO only spawn party if a row exists in db
//     // For now, okay to spawn all of them that don't
//     // currently have a host
//     for (const i in parties) {
//       const joinCode = parties[i];
//       const hostId = await redisClient.get(`party:${joinCode}:host`);
//       if (!hostId) {
//         trySpawnPartyHost(joinCode);
//       }
//     }
//   };

//   const usersChannel = supabaseAdmin.channel('users');
//   usersChannel.on('presence', { event: 'sync' }, handleUsersSync);
//   usersChannel.subscribe((status) => console.log('users channel ' + status));
// }

// bootstrap();

// const initializePresence = ({
//   channel,
//   actorManager,
//   partyActor,
// }: {
//   channel: RealtimeChannel;
//   actorManager: ActorManager;
//   partyActor: PartyActor;
// }) => {
//   const handleSpawnActor = async (payload: SpawnActorEvent) => {
//     // console.log('spawn', payload);
//   };

//   const handleActorSend = async ({ payload }: SendActorEvent) => {
//     const { actorId, event } = payload;
//     actorManager.getActor(actorId).send(event);
//   };

//   const handleSync = async () => {
//     await actorManager.syncAll();
//   };

//   const handleLeave = async (payload: PresenceState[]) => {
//     Object.values(payload['leftPresences'])
//       .filter((value) => !!value['userId'])
//       .map((p) => ({ userId: p['userId'] as string }))
//       .forEach((props) => {
//         partyActor.send(PartyEvents.PLAYER_DISCONNECTED(props));
//       });
//   };

//   const handleJoin = async (payload: PresenceState[]) => {
//     Object.values(payload['newPresences'])
//       .filter((value) => !!value['userId'])
//       .map((p) => ({ userId: p['userId'] as string }))
//       .forEach((props) => {
//         partyActor.send(PartyEvents.PLAYER_CONNECTED(props));
//       });
//   };

//   channel.on('presence', { event: 'sync' }, handleSync);
//   channel.on('presence', { event: 'leave' }, handleLeave);
//   channel.on('presence', { event: 'join' }, handleJoin);
//   channel.on('broadcast', { event: ActorEventType.SPAWN }, handleSpawnActor);
//   channel.on('broadcast', { event: ActorEventType.SEND }, handleActorSend);
// };
