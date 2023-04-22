// import {
//   LittleVigianteRoomOptions,
//   MachineOptions,
//   PlayerOptions,
//   StagingRoomOptions,
// } from '@explorers-club/schema';
// import { createMachine } from 'xstate';

// const createStagingRoomMachine = (options: StagingRoomOptions) =>
//   createMachine({
//     id: 'StagingRoom',
//     initial: 'Idle',
//     states: {
//       Idle: {},
//     },
//   });

// const createLittleVigilanteRoomMachine = (options: LittleVigianteRoomOptions) =>
//   createMachine({
//     id: 'LittleVigilanteRoom',
//     initial: 'Idle',
//     states: {
//       Idle: {},
//     },
//   });

// const createPlayerMachine = (options: PlayerOptions) =>
//   createMachine({
//     id: 'Player',
//     initial: 'Idle',
//     states: {
//       Idle: {},
//     },
//   });

// export const createMachineWithOptions = (options: MachineOptions) => {
//   switch (options.actorType) {
//     case 'player':
//       return createPlayerMachine(options);
//     case 'staging_room':
//       return createStagingRoomMachine(options);
//     case 'little_vigilante_room':
//       return createLittleVigilanteRoomMachine(options);
//     default:
//       throw new Error(`couldn't find machine for ${options}`);
//   }
// };

// // export const actorMachines: Record<ActorType, MachineCreator> = {
// //   staging_room: createStagingRoomMachine,
// //   little_vigilante_room: createLittleVigilanteRoomMachine,
// //   player: createPlayerMachine,
// // little_vigilante_room: createMachine({
// //   id: 'LittleVigilanteRoom',
// //   initial: 'Idle',
// //   states: {
// //     Idle: {},
// //   },
// // }),
// // player: createMachine({
// //   id: 'Player',
// //   initial: 'Idle',
// //   states: {
// //     Idle: {},
// //   },
// // }),
// // lobby_room: createMachine({
// //   id: 'LobbyRoom',
// //   initial: 'Idle',
// //   states: {
// //     Idle: {},
// //   },
// // }),
// // codebreakers_room: createMachine({
// //   id: 'CodebreakersRoom',
// //   initial: 'Idle',
// //   states: {
// //     Idle: {},
// //   },
// // }),
// // };
