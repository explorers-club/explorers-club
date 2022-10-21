import {
  ActorManager,
  initializeActor,
  MachineFactory,
  setActorEvent,
  setActorState,
  setNewActor,
  SharedActorRef
} from '@explorers-club/actor';
import {
  createPartyMachine,
  createPartyPlayerMachine,
  getPartyActorId,
  PartyActor,
  PartyEvents
} from '@explorers-club/party';
import * as crypto from 'crypto';
import {
  onChildAdded, onDisconnect,
  onValue,
  push,
  ref,
  runTransaction
} from 'firebase/database';
import { fromRef, ListenEvent } from 'rxfire/database';
import { filter, map } from 'rxjs';
import { AnyInterpreter } from 'xstate';
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

  const initializeParty = (joinCode: string) => {
    console.debug('hosting ' + joinCode);

    const partyActorId = getPartyActorId(joinCode);
    const actorManager = new ActorManager(partyActorId);

    // Grab any persisted state from database and initialize using it
    const stateRef = ref(
      db,
      `parties/${joinCode}/actors/${partyActorId}/state`
    );
    onValue(
      stateRef,
      async (snap) => {
        // actorData should usually be empty unless resuming from a crash/restart
        const stateJSON = snap.val() as string | undefined;
        let actor: AnyInterpreter;

        const sharedActorRef: SharedActorRef = {
          actorId: partyActorId,
          actorType: 'PARTY_ACTOR',
        };

        // If we have an party actor already, hydrate from it's state
        if (stateJSON) {
          actor = actorManager.hydrate({
            ...sharedActorRef,
            stateJSON,
          });
        } else {
          // Otherwise spawn a new one
          actor = actorManager.spawn(sharedActorRef);

          const stateJSON = JSON.stringify(actor.getSnapshot());
          await setActorState(stateRef, stateJSON);

          const actorsRef = ref(db, `parties/${joinCode}/actor_list`);
          const newActorRef = push(actorsRef);
          await setNewActor(newActorRef, sharedActorRef);
        }

        /**
         * Update actor data in db when there is a new event
         * to push it out to clients
         */
        actor.onEvent(async (event) => {
          const stateRef = ref(
            db,
            `parties/${joinCode}/actors/${partyActorId}/state`
          );
          const eventRef = ref(
            db,
            `parties/${joinCode}/actors/${partyActorId}/event`
          );
          const stateJSON = JSON.stringify(actor.getSnapshot());

          await Promise.all([
            setActorEvent(eventRef, event),
            setActorState(stateRef, stateJSON),
          ]);
        });

        connectPartyObservables(actor);
      },
      {
        onlyOnce: true,
      }
    );

    const actorsRef = ref(db, `parties/${joinCode}/actor_list`);

    const sharedActorRef$ = fromRef(actorsRef, ListenEvent.added).pipe(
      map((change) => change.snapshot.val() as SharedActorRef)
    );

    // For each actor that exists (and gets added), this will
    // fetch their state, connect a listen for new events, and
    // hydrate it with the actor manager
    sharedActorRef$.subscribe((sharedActorRef) => {
      initializeActor(db, joinCode, sharedActorRef, actorManager);
    });

    /**
     * Sets up observables on on the firebase actor list and
     * creates and send events to the main party actor when things happen
     * @param actor
     */
    const connectPartyObservables = (actor: PartyActor) => {
      const playerActor$ = sharedActorRef$.pipe(
        filter(({ actorType }) => actorType === 'PLAYER_ACTOR')
      );

      const newPlayer$ = playerActor$.pipe(
        filter(
          ({ actorId }) =>
            !actor.getSnapshot().context.playerActorIds.includes(actorId) // TODO use hashmap
        )
      );

      // Send player join event
      newPlayer$.subscribe(({ actorId }) => {
        const event = PartyEvents.PLAYER_JOINED({ actorId });
        actor.send(event);
      });
    };
  };

  const userConnectionsRef = ref(db, 'user_party_connections');
  onChildAdded(userConnectionsRef, (data) => {
    const joinCode = data.val();
    trySpawnPartyHost(joinCode);
  });
}

bootstrap();
