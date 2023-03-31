import {
  ArchetypeEvent,
  createArchetypeIndex,
} from '@explorers-club/ecs';
// import { ActorSchema, StagingRoomSchema } from '@explorers-club/schema';
import { ObservableProps } from '@explorers-club/utils';
import { filter } from 'rxjs';
import { assign, createMachine, StateFrom } from 'xstate';
import { z } from 'zod';
import { AppContext, AppEvent, AppServiceOptions } from '../schema';

export const createAppMachine = ({
  trpcClient,
  world,
  activeRoom,
}: AppServiceOptions) => {
  // todo maybe later expose archetype on world context
  // const actorArchetype = world.with<z.infer<typeof ActorSchema>>(
  //   'id',
  //   'flushedAt',
  //   'actorType',
  //   'context',
  //   'states'
  // );
  // const actorEntitiesEvent$ = createArchetypeEvent$(actorArchetype);
  // type ActorEntityEvent = ObservableProps<typeof actorEntitiesEvent$>;
  type Event = AppEvent;

  // const roomArchetype = world.with(
  //   'id',
  //   'name',
  //   'schema',
  //   'playerIds'
  // );

  // const room$ = createArchetypeEvent$(roomArchetype);


  // type ActorArchetype = z.infer<typeof ActorSchema>;
  // type ActorArchetype = FromArchetype<typeof actorArchetype>;

  // const actorEntitiesIndex = createArchetypeIndex(actorArchetype);

  // const isStagingRoomActorEvent = (
  //   event: ArchetypeEvent<ActorArchetype>
  // ): event is ArchetypeEvent<z.infer<typeof StagingRoomSchema>> => {
  //   if (event.type === 'INIT') {
  //     return false;
  //   }

  //   return StagingRoomSchema.safeParse(event.data).success;
  // };

  // const stagingRoomActorEvent$ = actorEntitiesEvent$.pipe(
  //   filter(isStagingRoomActorEvent)
  // );

  return createMachine({
    id: 'AppMachine',
    initial: 'Idle',
    type: 'parallel',
    context: {
      activeRoom,
    },
    schema: {
      context: {} as AppContext,
      events: {} as Event,
    },
    states: {
      Navigation: {
        initial: 'Closed',
        states: {
          Open: {
            on: {
              CLOSE_NAV: 'Closed',
              START_ROOM: 'Closed',
            },
          },
          Closed: {
            on: {
              OPEN_NAV: 'Open',
            },
          },
        },
      },
      Focus: {
        initial: 'MainScene',
        states: {
          MainScene: {},
          MainScreen: {},
        },
      },
      Current: {
        initial: !activeRoom ? 'Home' : 'Room',
        states: {
          Home: {
            on: {
              JOIN_ROOM: {
                target: 'Room',
                actions: [
                  (_, event) => {
                    window.history.pushState({}, '', `/${event.name}`);
                  },
                  assign({
                    activeRoom: (_, event) => event.name,
                  }),
                ],
              },
            },
          },
          Room: {},
        },
      },
      MainScene: {
        type: 'parallel',
        states: {
          Loaded: {},
        },
      },
      MainScreen: {
        type: 'parallel',
        states: {
          Layout: {
            initial: 'Docked',
            states: {
              Docked: {},
              Overlay: {},
            },
          },
        },
      },
    },
  });
};
export type AppMachine = ReturnType<typeof createAppMachine>;
export type AppState = StateFrom<AppMachine>;
