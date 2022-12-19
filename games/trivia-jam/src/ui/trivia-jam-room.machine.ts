// import { TriviaJamRoomCommand } from '@explorers-club/commands';
// import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
// import { fromRoom } from '@explorers-club/utils';
// import { Room } from 'colyseus.js';
// import { filter, map } from 'rxjs';
// import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
// import { selectAllPlayersConnected } from './trivia-jam-room.selectors';

// interface TriviaJamRoomContext {
//   room: Room<TriviaJamState>;
// }

// const ALL_PLAYERS_CONNECTED = 'ALL_PLAYERS_CONNECTED';

// type TriviaJamRoomEvents =
//   | TriviaJamRoomCommand
//   | { type: typeof ALL_PLAYERS_CONNECTED };

// export const triviaJamRoomMachine = createMachine(
//   {
//     id: 'TriviaJamRoomMachine',
//     initial: 'Initializing',
//     schema: {
//       context: {} as TriviaJamRoomContext,
//       events: {} as TriviaJamRoomEvents,
//     },
//     states: {
//       Initializing: {
//         always: [
//           {
//             target: 'Playing',
//             cond: 'allPlayersConnected',
//           },
//           {
//             target: 'Waiting',
//           },
//         ],
//       },
//       Waiting: {
//         invoke: {
//           src: ({ room }) =>
//             fromRoom(room).pipe(
//               filter(selectAllPlayersConnected),
//               map(() => ({
//                 type: ALL_PLAYERS_CONNECTED,
//               }))
//             ),
//         },
//         on: {
//           ALL_PLAYERS_CONNECTED: 'Playing',
//         },
//       },
//       Playing: {
//         initial: 'AwaitingQuestion',
//         states: {
//           AwaitingQuestion: {
//             on: {
//               CONTINUE: 'Question',
//             },
//           },
//           Question: {
//             initial: 'Loading',
//             states: {
//               Loading: {
//                 // invoke: {
//                 //   id: 'loadNextQuestion',
//                 //   src: 'loadNextQuestion',
//                 //   onDone: {
//                 //     target: 'Presenting',
//                 //     // actions: assign<
//                 //     //   TriviaJamSharedContext,
//                 //     //   LoadNextQuestionDoneEvent
//                 //     // >({
//                 //     //   questions: ({ questions }, event) => [
//                 //     //     ...questions,
//                 //     //     event.data,
//                 //     //   ],
//                 //     // }),
//                 //   },
//                 // },
//               },
//               Presenting: {
//                 // invoke: {
//                 //   id: 'onShowQuestionPromptComplete',
//                 //   src: 'onShowQuestionPromptComplete',
//                 //   onDone: 'Responding',
//                 // },
//               },
//               // Responding: {
//               //   invoke: {
//               //     id: 'onResponseComplete',
//               //     src: 'onResponseComplete',
//               //     onDone: 'Reviewing',
//               //   },
//               // },
//               // Reviewing: {
//               //   invoke: {
//               //     id: 'onHostPressContinue',
//               //     src: 'onHostPressContinue',
//               //     onDone: 'Complete',
//               //   },
//               // },
//               // Complete: {
//               //   type: 'final' as const,
//               // },
//             },
//           },
//         },
//       },
//       GameOver: {},
//     },
//     predictableActionArguments: true,
//   },
//   {
//     guards: {
//       allPlayersConnected: ({ room }) => selectAllPlayersConnected(room.state),
//     },
//   }
// );

// export type TriviaJamRoomMachine = typeof triviaJamRoomMachine;
// export type TriviaJamRoomService = ActorRefFrom<TriviaJamRoomMachine>;
// export type TriviaJamRoomState = StateFrom<TriviaJamRoomMachine>;
