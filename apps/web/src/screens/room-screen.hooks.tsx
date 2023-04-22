// import { trpc } from '@explorers-club/api-client';
// import { useContext, useState } from 'react';
// import { assign, createMachine, InterpreterFrom } from 'xstate';
// import { useServiceSelector } from '../services';
// import { WorldContext } from '../state/world.context';

// export const useRoomScreenMachine = () => {
//   const name = useServiceSelector(
//     'appService',
//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     (state) => state.context.activeRoom!
//   );

//   const { client } = trpc.useContext();
//   const { archetypes } = useContext(WorldContext);

//   // Algo here:
//   // 1. Get list of all entities
//   // 2. "deposit" all the entities in to our own local world store.
//   // `actor` is the actor.
//   // 3. this state machine then gets all thoes entities, and can then set up their own
//   //      entity subscription
//   // you get the initial state basically.
//   //
//   // This technique is going to work for both "slow" services as well as "fast" ones.
//   // is there any reason to.... sync more data in the room router

//   const [roomScreenMachine] = useState(() => {
//     // const stagingRoom = archetypes.stagingRoom;
//     // const query = stagingRoom.where((entity) => entity.stagingRoom === name);
//     // for (const entity of query) {
//     //   console.log(entity);
//     // }
//     // archetypes.stagingRoom.subscribe((entity) => {
//     //   console.log(entity);
//     // });

//     return createMachine(
//       {
//         id: 'RoomMachine',
//         type: 'parallel',
//         context: {
//           name,
//         },
//         schema: {
//           context: {} as { name: string },
//           events: {} as
//             | { type: 'JOIN' }
//         },
//         states: {
//           Connection: {
//             initial: 'Connecting',
//             states: {
//               Connecting: {
//                 invoke: {
//                   src: 'connect',
//                   onDone: {
//                     target: 'Connected',
//                   },
//                 },
//               },
//               Connected: {},
//               Disconnected: {},
//             },
//           },
//         },
//       },
//       {
//         services: {
//           connect: () => async () => {},
//         },
//       }
//     );
//   });

//   return roomScreenMachine;
// };

// export type RoomScreenService = InterpreterFrom<
//   ReturnType<typeof useRoomScreenMachine>
// >;
