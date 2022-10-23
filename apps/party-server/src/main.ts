import {
  ActorEvents,
  ActorID,
  ActorManager,
  getEventRef,
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
  DatabaseReference,
  get,
  onChildAdded,
  onDisconnect,
  push,
  ref,
  runTransaction,
  ThenableReference,
} from 'firebase/database';
import { fromRef, ListenEvent } from 'rxfire/database';
import { filter, first, map, skipWhile } from 'rxjs';
import { AnyEventObject, AnyInterpreter } from 'xstate';
import { db } from './lib/firebase';

// Presence app example
// https://firebase.google.com/docs/database/android/offline-capabilities#section-sample

// type PartyRow = Database['public']['Tables']['parties']['Row'];

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
    let myEventRef: DatabaseReference;
    let initialized = false;

    // Listen for events on all actors in the party
    const newEvent$ = fromRef(eventsRef, ListenEvent.changed);
    newEvent$.pipe(first()).subscribe((changes) => {
      const { actorId, event } = changes.snapshot.val() as SharedActorEvent;

      // Don't process events from ourself
      if (actorId === partyActorId) {
        return;
      }

      const actor = actorManager.getActor(actorId);
      if (!actor) {
        console.warn("Couldn't find actor " + actorId);
        return;
      }

      actor.send(event);
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

      const myStateRef = push(stateRef);
      await setActorState(myStateRef, actorManager.serialize(partyActorId));

      // maybe do this save in same trasaciton with the state?
      myEventRef = push(eventsRef);
      await setActorEvent(myEventRef, {
        actorId: partyActorId,
        event: { type: 'INIT' },
      });
    } else {
      // If we are resuming (party actor already spawned), just get
      // our event ref to log events to
      myEventRef = await getEventRef(eventsRef, partyActorId);

      if (!myEventRef) {
        throw new Error(
          "couldn't find event ref for existing party actor state: " +
            partyActorId
        );
      }
    }
    // Log our events to the database
    partyActor.onEvent(async (event) => {
      await setActorEvent(myEventRef, { actorId: partyActorId, event });
    });

    initialized = true;

    // connectPartyObservables(actor);
    // startGameLoop(actor);

    /**
     * Sets up observables on on the firebase actor list and
     * creates and send events to the main party actor when things happen
     * @param actor
     */
    // const connectPartyObservables = (actor: PartyActor) => {
    //   const playerActor$ = sharedActorRef$.pipe(
    //     filter(({ actorType }) => actorType === 'PLAYER_ACTOR')
    //   );

    //   const newPlayer$ = playerActor$.pipe(
    //     filter(
    //       ({ actorId }) =>
    //         !actor.getSnapshot().context.playerActorIds.includes(actorId) // TODO use hashmap
    //     )
    //   );

    //   // Send player join event
    //   newPlayer$.subscribe(({ actorId }) => {
    //     const event = PartyEvents.PLAYER_JOINED({ actorId });
    //     actor.send(event);
    //   });
    // };
  };

  const userConnectionsRef = ref(db, 'user_party_connections');
  onChildAdded(userConnectionsRef, (data) => {
    const joinCode = data.val();
    trySpawnPartyHost(joinCode);
  });
}

const TICK_RATE = 60; // Number of times per second the server game loop runs

const startGameLoop = (actor: AnyInterpreter) => {
  const interval = 1000 / TICK_RATE;

  const timer = setInterval(() => {
    // If
    actor;
  }, interval);
};

bootstrap();
