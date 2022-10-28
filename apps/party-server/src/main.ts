import {
  ActorManager,
  MachineFactory,
  SerializedSharedActor,
  setActorEvent,
  setActorState,
  SharedActorEvent,
} from '@explorers-club/actor';
import {
  createPartyMachine,
  createPartyPlayerMachine,
  getPartyActorId,
  PartyEvents,
} from '@explorers-club/party';
import * as crypto from 'crypto';
import {
  get,
  onChildAdded,
  onDisconnect,
  ref,
  runTransaction,
} from 'firebase/database';
import { fromRef, ListenEvent } from 'rxfire/database';
import { map, skipWhile } from 'rxjs';
import { db } from './lib/firebase';

// Presence app example
// https://firebase.google.com/docs/database/android/offline-capabilities#section-sample

MachineFactory.registerMachine('PARTY_ACTOR', createPartyMachine);
MachineFactory.registerMachine('PLAYER_ACTOR', createPartyPlayerMachine);

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

  const initializeParty = async (joinCode: string) => {
    console.debug('hosting ' + joinCode);
    const partyActorId = getPartyActorId(joinCode);
    const actorManager = new ActorManager(partyActorId);
    const stateRef = ref(db, `parties/${joinCode}/actor_state`);
    const eventsRef = ref(db, `parties/${joinCode}/actor_events`);

    const myEventRef = ref(
      db,
      `parties/${joinCode}/actor_events/${partyActorId}`
    );
    const myStateRef = ref(
      db,
      `parties/${joinCode}/actor_state/${partyActorId}`
    );
    let initialized = false;

    // Listen for any changes to the events ref
    const newEvent$ = fromRef(eventsRef, ListenEvent.changed);
    newEvent$.subscribe(async (changes) => {
      const { actorId, event } = changes.snapshot.val() as SharedActorEvent; // way to make this safer?
      const actor = actorManager.getActor(actorId);
      if (!actor) {
        console.warn("Couldn't find actor " + actorId);
        return;
      }

      // Don't process events sent from the host actor
      if (actorId !== partyActorId) {
        actor.send(event);
      }

      // Persist updated state in db
      const actorStateRef = ref(
        db,
        `parties/${joinCode}/actor_state/${actorId}`
      );
      await setActorState(actorStateRef, actorManager.serialize(actorId));
    });

    // Listen for new actors and hydrate them
    const actorAdded$ = fromRef(stateRef, ListenEvent.added).pipe(
      skipWhile(() => !initialized),
      map((change) => change.snapshot.val() as SerializedSharedActor)
    );
    actorAdded$.subscribe((serializedActor: SerializedSharedActor) => {
      actorManager.hydrate(serializedActor);

      if (serializedActor.actorType === 'PLAYER_ACTOR') {
        partyActor.send(
          PartyEvents.PLAYER_JOINED({ actorId: serializedActor.actorId })
        );
      }
    });

    // Get initial state and hydrate it
    const stateSnapshot = await get(stateRef);
    const stateMap = (stateSnapshot.val() || {}) as Record<
      string,
      SerializedSharedActor
    >;
    const serializedActors = Object.values(stateMap);
    actorManager.hydrateAll(serializedActors);

    // If there is no party actor present, spawn one
    let partyActor = actorManager.rootActor;
    if (!partyActor) {
      partyActor = actorManager.spawn({
        actorId: partyActorId,
        actorType: 'PARTY_ACTOR',
      });

      // do these together in same transaction?
      await setActorState(myStateRef, actorManager.serialize(partyActorId));
      await setActorEvent(myEventRef, {
        actorId: partyActorId,
        event: { type: 'INIT' },
      });
    }

    // Log our events to the database
    partyActor.onEvent(async (event) => {
      await setActorEvent(myEventRef, { actorId: partyActorId, event });
    });

    initialized = true;
  };

  const userConnectionsRef = ref(db, 'user_party_connections');
  onChildAdded(userConnectionsRef, (data) => {
    const joinCode = data.val();
    trySpawnPartyHost(joinCode);
  });
}

bootstrap();
