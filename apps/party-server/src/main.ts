import {
  ActorEvent,
  ActorEvents,
  ActorEventType,
  ActorID,
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
import { AnyEventObject } from 'xstate';
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
    await !!runTransaction(hostRef, (currentHostId) => {
      // If a host is already set, bail
      if (currentHostId) {
        return undefined;
      }

      initializeParty(joinCode);

      onDisconnect(hostRef).remove();
      return hostId;
    });
  };

  const initializeParty = (joinCode: string) => {
    console.debug('hosting ' + joinCode);

    const partyActorId = getPartyActorId(joinCode);
    const actorManager = new ActorManager(partyActorId);

    const actorsRef = ref(db, `parties/${joinCode}/actors`);
    const eventsRef = ref(db, `parties/${joinCode}/events`);

    onChildAdded(eventsRef, (snap) => {
      const event = snap.val() as ActorEvent;
      if (event.type === ActorEventType.SPAWN) {
        console.debug('spawn', event);
        // TODO fix event 'type' typings to avoid this cast
        actorManager.hydrate(event.payload as SerializedSharedActor);
      } else if (event.type === ActorEventType.SEND) {
        console.debug('send', event);
        const payload = event.payload as {
          actorId: ActorID;
          event: AnyEventObject;
        };

        if (payload.actorId !== partyActorId) {
          const actor = actorManager.getActor(payload.actorId);
          actor.send(payload.event);
        }
      }
    });

    // Immediately spawn the main party actor...
    onValue(
      actorsRef,
      (snap) => {
        const actorData = (snap.val() || []) as SerializedSharedActor[];
        actorManager.hydrateAll(actorData);

        const actorId = partyActorId;
        const actorType = 'PARTY_ACTOR';

        // If a root actor hasn't been spawned yet for the party, spawn one
        if (!actorManager.rootActor) {
          const rootActor = actorManager.spawn({
            actorId,
            actorType,
          });

          const newEventRef = push(eventsRef);
          set(
            newEventRef,
            ActorEvents.SPAWN({
              actorId,
              actorType,
              actor: rootActor,
            })
          ).then(noop);
        }

        actorManager.rootActor.onEvent((event) => {
          console.log('root actor event', event);
          const newEventRef = push(eventsRef);
          set(
            newEventRef,
            ActorEvents.SEND({
              actorId: partyActorId,
              event,
            })
          ).then(noop);
        });

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
    const joinCode = data.val();
    trySpawnPartyHost(joinCode);
  });
}

bootstrap();

/**
 * Runs the logic for the party in a loop.
 * @param joinCode
 * @param actorManager
 */
const runPartyLoop = async (joinCode: string, actorManager: ActorManager) => {
  const actorsRef = ref(db, `parties/${joinCode}/actors`);

  const loop = () => {
    // Backup current state every 500ms
    const actorsJSON = actorManager.serializeAll();
    set(actorsRef, actorsJSON).then(noop);
    setTimeout(loop, 500);
  };

  loop();
};
