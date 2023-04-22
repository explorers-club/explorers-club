// import { createMachine, InterpreterFrom, StateFrom } from 'xstate';
// import { AppContext, AppEvent } from '../schema';

// // const AppEventSchema = z.union([
// //   //   z.object({
// //   //     type: z.literal('FOCUS_SCENE'),
// //   //   }),
// // ]);

// // type AppEvent =
// //   | {
// //       type: 'FOCUS_SCENE';
// //     }
// //   | {
// //       type: 'FOCUS_SCREEN';
// //     }
// //   | {
// //       type: 'FOCUS_NAV';
// //     }
// //   | {
// //       type: 'CLOSE_NAV';
// //     }
// //   | {
// //       type: 'OPEN_NAV';
// //     }
// //   | {
// //       type: 'START_NEW';
// //     };

// export const appMachine = createMachine({
//   id: 'AppMachine',
//   initial: 'Idle',
//   type: 'parallel',
//   schema: {
//     context: {} as AppContext,
//     events: {} as AppEvent,
//   },
//   states: {
//     Focus: {
//       initial: 'MainScene',
//       states: {
//         Navigation: {
//           on: {
//             CLOSE_NAV: 'MainScene',
//             FOCUS_SCREEN: 'MainScreen',
//           },
//         },
//         MainScene: {
//           on: {
//             FOCUS_NAV: 'Navigation',
//             FOCUS_SCREEN: 'MainScreen',
//           },
//         },
//         MainScreen: {
//           on: {
//             FOCUS_NAV: 'Navigation',
//             FOCUS_SCENE: 'MainScene',
//           },
//         },
//       },
//     },
//     MainScene: {
//       initial: 'Loading',
//       states: {
//         Loading: {},
//         Loaded: {},
//       },
//     },
//     MainScreen: {
//       type: 'parallel',
//       states: {
//         Layout: {
//           initial: 'Docked',
//           states: {
//             Docked: {},
//             Overlay: {},
//           },
//         },
//       },
//     },
//   },
// });

// type AppMachine = typeof appMachine;
// export type AppState = StateFrom<AppMachine>;
// export type AppService = InterpreterFrom<AppMachine>;
