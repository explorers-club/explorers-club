import {
  ActorEvent,
  ActorEvents, ActorManager,
  isSendEvent,
  isSpawnEvent,
  MachineFactory,
  ManagedActor,
  SendActorEvent,
  SerializedSharedActor,
  SpawnActorEvent
} from '@explorers-club/actor';
import {
  createPartyMachine,
  createPartyPlayerMachine,
  getPartyActorId,
  PartyEvents,
  PartyPlayerActor
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
  set
} from 'firebase/database';
import { filter, fromEvent } from 'rxjs';
import { isPartyPlayer } from './actors';
import { db } from './lib/firebase';

// Presence app example
// https://firebase.google.com/docs/database/android/offline-capabilities#section-sample

// type PartyRow = Database['public']['Tables']['parties']['Row'];

const runningParties = new Set();

async function bootstrap() {
  const hostId = crypto.randomUUID();

  const trySpawnPartyHost = async (joinCode: string) => {
    if (runningParties.has(joinCode)) {
      return;
    }

    const hostRef = ref(db, `parties/${joinCode}/host`);
    await runTransaction(hostRef, (currentHostId) => {
      // todo, theres an issue around currentHostId being unexpectedly null
      if (currentHostId) {
        return currentHostId;
      }

      initializeParty(joinCode);
      runningParties.add(joinCode);

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

    const handleSpawnActorEvent = ({ payload }: SpawnActorEvent) => {
      console.log('receive spawn', payload.actorId);
      actorManager.hydrate(payload);
    };

    const handleSendActorEvent = ({ payload }: SendActorEvent) => {
      // Don't allow events sent from/to the party
      if (payload.actorId === partyActorId) {
        return;
      }
      console.log('receive send', payload.actorId, payload.event.type);

      const actor = actorManager.getActor(payload.actorId);
      actor.send(payload.event);
    };

    // Whenever a new event is logged, process it
    onChildAdded(eventsRef, (snap) => {
      const event = snap.val() as ActorEvent;

      // Don't process events coming from the main party actor
      if (partyActorId === event.payload.actorId) {
        return;
      }

      if (isSpawnEvent(event)) {
        handleSpawnActorEvent(event);
      } else if (isSendEvent(event)) {
        handleSendActorEvent(event);
      }
    });

    const initialize = (actorData: SerializedSharedActor[]) => {
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
      const partyActor = actorManager.rootActor;

      // Listen for all root actor events that happen
      // and send them out on the network
      partyActor.onEvent((event) => {
        console.debug('sending', event);
        const newEventRef = push(eventsRef);
        set(
          newEventRef,
          ActorEvents.SEND({
            actorId: partyActorId,
            event,
          })
        ).then(noop);
      });

      const hydrate$ = fromEvent(actorManager, 'HYDRATE');
      hydrate$.pipe(filter(isPartyPlayer)).subscribe(({ actorId }) => {
        partyActor.send(PartyEvents.PLAYER_JOINED({ actorId }));
      });

      // Start the loop
      runPartyLoop(joinCode, actorManager);
    };

    // Grab any persisted state from database and initialize using it
    onValue(
      actorsRef,
      (snap) => {
        // actorData should usually be empty unless resuming from a crash/restart
        const actorData = (snap.val() || []) as SerializedSharedActor[];
        initialize(actorData);
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
