import {
  ArchetypeListEvent,
  createArchetypeIndex,
  generateSnowflakeId,
} from '@explorers-club/ecs';
import {
  Entity,
  EntityEventSchema,
  SchemaLiteralsSchema,
  SnowflakeId,
  SnowflakeIdSchema,
} from '@explorers-club/schema';
import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { AnyInterpreter, interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import { z } from 'zod';
import { getEntityService, registerEntityService } from '../../entities';
import { machineMap } from '../../machines';
import { protectedProcedure, publicProcedure, router } from '../../trpc';
import { world } from '../../world';

const [_, entity$] = createArchetypeIndex(world.with('id'), 'id');

export const entityRouter = router({
  list: publicProcedure.subscription(({ ctx }) => {
    return observable<ArchetypeListEvent<Entity>>((emit) => {
      // todo listen for changes on the connection state

      // TODO apply policy filtering to control access
      // as a pipe in the index
      // this will allow user-level control of things
      // if the user isnt logged in, user won't have access to things
      const sub = entity$.subscribe(emit.next);

      return () => {
        if (!sub.closed) {
          sub.unsubscribe();
        }
      };
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        schema: SchemaLiteralsSchema,
      })
    )
    .mutation(async ({ input }) => {
      const { schema } = input;

      const machine = machineMap[schema]({ world, schema });
      const service = interpret(machine);

      registerEntityService(service);
      service.send({
        type: 'INITIALIZE',
        id: generateSnowflakeId(),
      });

      try {
        await waitFor(service, (state) => state.matches('Initialized'));
      } catch (ex) {
        throw new TRPCError({
          code: 'TIMEOUT',
          message: 'Timed out waiting for initialize',
          cause: ex,
        });
      }

      const state = service.getSnapshot();
      if (!state.matches('Initialized')) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to initialize entity',
        });
      }

      // todo make the types on this better..
      if (!state.context.entity) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'No entity found in context. Service not initialized correctly',
        });
      }

      return state.context.entity;
    }),
  events: protectedProcedure
    .input(
      z.object({
        id: SnowflakeIdSchema,
      })
    )
    .subscription(async ({ input }) => {
      const service = await getEntityServiceWithErrors(input.id);

      return observable((emit) => {
        const sub = service.subscribe((state) => {
          emit.next(state.event);
        });

        return () => {
          sub.unsubscribe();
        };
      });
    }),
  changes: protectedProcedure
    .input(
      z.object({
        id: SnowflakeIdSchema,
      })
    )
    .subscription(async ({ input }) => {
      const service = await getEntityServiceWithErrors(input.id);

      return observable<
        { type: 'INIT'; data: Entity } | { type: 'CHANGE'; data: Entity }
      >((emit) => {
        emit.next({ type: 'INIT', data: service.getSnapshot().context.entity });
        const sub = service.subscribe((state) => {
          if (state.context.entity) {
            // todo only do this if there's a change so clients dont process it
            emit.next({ type: 'CHANGE', data: state.context.entity });
          } else {
            emit.complete();
            sub.unsubscribe();
          }
        });

        return () => {
          sub.unsubscribe();
        };
      });
    }),
  send: protectedProcedure
    .input(
      z.object({
        id: SnowflakeIdSchema,
        event: EntityEventSchema,
      })
    )
    .mutation(async ({ input }) => {
      const service = await getEntityServiceWithErrors(input.id);
      service.send(event);
    }),
});

const getEntityServiceWithErrors = async (id: SnowflakeId) => {
  let service: AnyInterpreter | undefined;
  try {
    service = await getEntityService(id);
  } catch (ex) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error when getting entity service',
      cause: ex,
    });
  }

  if (!service) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: "Couldn't find entity service",
    });
  }

  return service;
};
