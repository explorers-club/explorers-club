import { ClubNameSchema, SnowflakeIdSchema } from '@explorers-club/schema';
import { z } from 'zod';
import { protectedProcedure, router } from '../../trpc';

const RoomSchema = z.object({
  id: SnowflakeIdSchema,
  name: ClubNameSchema,
});
type Room = z.infer<typeof RoomSchema>;

// const createRoomMachine = (props: { world: World; entity: RoomEntity }) => {
//   const roomMachine = createMachine({
//     id: 'RoomMachine',
//     context: {
//       foo: 'bar',
//     },
//     type: 'parallel',
//     schema: {
//       context: {} as { foo: 'bar' },
//     },
//     states: {
//       Listed: {
//         initial: 'Yes',
//         states: {
//           No: {},
//           Yes: {},
//         },
//       },
//       Visbility: {
//         initial: 'Anyone',
//         states: {
//           Anyone: {},
//           LoggedIn: {},
//           Friends: {},
//         },
//       },
//     },
//   });
//   return roomMachine;
// };

// type RoomMachine = ReturnType<typeof createRoomMachine>;

export const roomRouter = router({
  start: protectedProcedure
    .input(z.object({ name: ClubNameSchema }))
    .mutation(async ({ ctx, input }) => {
      // createRoomMachine({
      //   world,
      // })
      // const entity = {
      //   id: generateSnowflakeId(),
      //   schema: "staging_room",
      //   indexKey: "roomName",
      //   roomName: input.name,
      //   playersIds: []
      // } satisfies StagingRoomEntity;

      // const machine = createRoomMachine({ world, entity });

      // const service = interpret(machine);
      // entityServices.set(entity.id, service);

      // service.subscribe((snapshot) => {
      //   world.update(entity, "states", snapshot.toStrings())
      //   // todo update event here too
      // });
      // service.start();
      // world.add(entity);

      // todo move this in to a background process
      // const initialState = service.getSnapshot();
      // const {supabaseClient} =ctx.connectionState.context;
      // const result = await supabaseClient.from('rooms').insert({
      //   name: input.name,
      //   states: initialState.toStrings(),
      //   context: initialState.context as any,
      //   created_by: initialState.session.user.id,
      //   created_session_id: ctx.connectionState.context.deviceService,
      //   server_instance_id: ctx.instanceId,
      // });

      // if (result.error) {
        // non-fatal for now, dont carea bout db persist yet
        // throw new TRPCError({
        //   code: 'INTERNAL_SERVER_ERROR',
        //   message: result.error.message,
        //   cause: result.error,
        // });
      // }

      // return result;
    }),
  // .mutation(async ({ ctx, input }) => {
  //   const result = await ctx.supabaseClient.from('rooms').insert({
  //     name: input.name,
  //     states: [],
  //     context: {},
  //     created_by: ctx.authState.session.user.id,
  //     created_session_id: ctx.authState.sessionId,
  //   });

  //   if (result.error) {
  //     throw new TRPCError({
  //       code: 'INTERNAL_SERVER_ERROR',
  //       message: result.error.message,
  //       cause: result.error,
  //     });
  //   }

  //   return result;
  // }),
});
