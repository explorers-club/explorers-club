import {
  ActorID,
  createActorByIdSelector,
  SharedCollectionActor
} from '@explorers-club/actor';
import { filter, first, from, lastValueFrom } from 'rxjs';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { ModelContextFrom, ModelEventsFrom } from 'xstate/lib/model.types';
import { LobbyPlayerActor } from './lobby-player.machine';
import { LobbySharedEvents } from './lobby-shared.machine';
import { selectLobbyPlayerActors } from './lobby.selectors';

const LobbyServerModel = createModel(
  {
    userId: '' as string,
    playerName: undefined as string | undefined,
  },
  {
    events: {
      ALL_PLAYERS_READY: () => ({}),
      PLAYER_NOT_READY: () => ({}),
      GAME_CREATED: () => ({}),
    },
  }
);

export type LobbyServerContext = ModelContextFrom<typeof LobbyServerModel>;
export type LobbyServerEvent = ModelEventsFrom<typeof LobbyServerModel>;

export const LobbyServerEvents = LobbyServerModel.events;

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
  console.log('shared collection actor on lobby server', sharedActorId);
  const selectSharedActor = createActorByIdSelector(sharedActorId);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const sharedActor = selectSharedActor(sharedCollectionActor.getSnapshot()!);
  const initial = sharedActor?.getSnapshot()?.value;
  console.log({ initial });
  // const lobbySharedActor:
  // sharedCollectionActor(j0)

  from(sharedCollectionActor)
    .pipe()
    .subscribe((state) => {
      console.log('sub state', state.event);
    });

  return createMachine<LobbyServerContext, LobbyServerEvent>(
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
            5000: 'CreatingGame',
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
        waitForAllPlayersReady: async () => {
          const allPlayersReady$ = from(sharedCollectionActor).pipe(
            filter((state) => {
              const actors: LobbyPlayerActor[] = selectLobbyPlayerActors(
                state
              ) as LobbyPlayerActor[];
              const readyActors = actors.filter((actor) =>
                actor.getSnapshot()?.matches('Ready.Yes')
              );
              return actors.length >= 2 && readyActors.length === actors.length;
            }, first())
          );
          await lastValueFrom(allPlayersReady$); // https://rxjs.dev/deprecations/to-promise#lastvaluefrom
        },

        waitForAnyPlayerNotReady: async () => {
          const anyPlayerNotReady$ = from(sharedCollectionActor).pipe(
            filter((state) => {
              const actors: LobbyPlayerActor[] = selectLobbyPlayerActors(
                state
              ) as LobbyPlayerActor[];
              const readyActors = actors.filter((actor) =>
                actor.getSnapshot()?.matches('Ready.Yes')
              );
              return readyActors.length !== actors.length;
            }, first())
          );
          await lastValueFrom(anyPlayerNotReady$); // https://rxjs.dev/deprecations/to-promise#lastvaluefrom
        },
      },
    }
  );
};

export type LobbyServerMachine = ReturnType<typeof createLobbyServerMachine>;
export type LobbyServerActor = ActorRefFrom<LobbyServerMachine>;
export type LobbyServerState = StateFrom<LobbyServerMachine>;
