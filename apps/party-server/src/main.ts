import {
  ActorEvents,
  ActorManager,
  initializeActor, setActorEvent,
  setActorState,
  setNewActor,
  SharedActorRef
} from '@explorers-club/actor';
import {
  getPartyActorId,
  PartyActor,
  PartyEvents
} from '@explorers-club/party';
import * as crypto from 'crypto';
import {
  DataSnapshot,
  onChildAdded,
  onDisconnect,
  onValue,
  push,
  ref,
  runTransaction
} from 'firebase/database';
import { filter, fromEvent } from 'rxjs';
import { AnyInterpreter } from 'xstate';
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

          // TODO dry up this code with client join party code
          const stateJSON = JSON.stringify(actor.getSnapshot());
          await setActorState(stateRef, stateJSON);

          const actorsRef = ref(db, `parties/${joinCode}/actor_list`);
          const newActorRef = push(actorsRef);
          await setNewActor(newActorRef, sharedActorRef);
        }

        actor.onEvent(async (event) => {
          console.debug('sending', event);
          const eventRef = ref(
            db,
            `parties/${joinCode}/actors/${partyActorId}/event`
          );
          await setActorEvent(
            eventRef,
            ActorEvents.SEND({
              actorId: partyActorId,
              event,
            })
          );
        });

        connectPartyActorObservables(actor);
      },
      {
        onlyOnce: true,
      }
    );

    const actorsRef = ref(db, `parties/${joinCode}/actor_list`);
    onChildAdded(actorsRef, (snap: DataSnapshot) => {
      const ref = snap.val() as SharedActorRef;
      console.log('new actor', ref);
      initializeActor(db, joinCode, ref, actorManager);
    });

    const connectPartyActorObservables = (actor: PartyActor) => {
      const hydrate$ = fromEvent(actorManager, 'HYDRATE');
      hydrate$.pipe(filter(isPartyPlayer)).subscribe(({ actorId }) => {
        actor.send(PartyEvents.PLAYER_JOINED({ actorId }));
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
