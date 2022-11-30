import {
  ActorID,
  createActorByIdSelector,
  SharedCollectionActor
} from '@explorers-club/actor';
import { filter, from, take } from 'rxjs';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { LobbyPlayerActor } from './lobby-player.machine';
import { LobbySharedEvents } from './lobby-shared.machine';
import { selectLobbyPlayerActors } from './lobby.selectors';

interface CreateProps {
  sharedCollectionActor: SharedCollectionActor;
  sharedActorId: ActorID;
}

/**
 * The lobby servermachine mimics the state of the shared state, but
 * actually runs the logic behind it using services
 * @param
 * @returns
 */
export const createLobbyServerMachine = ({
  sharedCollectionActor,
  sharedActorId,
}: CreateProps) => {
  const selectSharedActor = createActorByIdSelector(sharedActorId);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const sharedActor = selectSharedActor(sharedCollectionActor.getSnapshot()!);
  const initial = sharedActor?.getSnapshot()?.value;

  return createMachine(
    {
      id: 'LobbyServerMachine',
      initial,
      states: {
        Waiting: {
          invoke: {
            src: 'waitForAllPlayersReady',
            onDone: {
              target: 'AllReady',
              actions: () => {
                sharedActor?.send(LobbySharedEvents.ALL_PLAYERS_READY());
              },
            },
          },
        },
        AllReady: {
          after: {
            5000: {
              target: 'CreatingGame',
              actions: () => {
                sharedActor?.send(LobbySharedEvents.START_GAME());
              },
            },
          },
          invoke: {
            src: 'waitForAnyPlayerNotReady',
            onDone: {
              target: 'Waiting',
              actions: () => {
                sharedActor?.send(LobbySharedEvents.PLAYER_NOT_READY());
              },
            },
          },
        },
        CreatingGame: {},
        EnteringGame: {},
      },
      predictableActionArguments: true,
    },
    {
      services: {
        waitForAllPlayersReady: async () =>
          new Promise((resolve) => {
            from(sharedCollectionActor)
              .pipe(
                filter((state) => {
                  const actors: LobbyPlayerActor[] = selectLobbyPlayerActors(
                    state
                  ) as LobbyPlayerActor[];
                  const readyActors = actors.filter((actor) =>
                    actor.getSnapshot()?.matches('Ready.Yes')
                  );
                  return (
                    actors.length >= 2 && readyActors.length === actors.length
                  );
                }, take(1))
              )
              .subscribe(resolve);
          }),
        waitForAnyPlayerNotReady: async () =>
          new Promise((resolve) => {
            from(sharedCollectionActor)
              .pipe(
                filter((state) => {
                  const actors: LobbyPlayerActor[] = selectLobbyPlayerActors(
                    state
                  ) as LobbyPlayerActor[];
                  const readyActors = actors.filter((actor) =>
                    actor.getSnapshot()?.matches('Ready.Yes')
                  );
                  return (
                    actors.length < 2 || readyActors.length !== actors.length
                  );
                }, take(1))
              )
              .subscribe(resolve);
          }),
      },
    }
  );
};

export type LobbyServerMachine = ReturnType<typeof createLobbyServerMachine>;
export type LobbyServerActor = ActorRefFrom<LobbyServerMachine>;
export type LobbyServerState = StateFrom<LobbyServerMachine>;
