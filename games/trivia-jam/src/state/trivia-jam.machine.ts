import { TriviaJamCommand } from '@explorers-club/commands';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { Room } from 'colyseus';
import { Observable } from 'rxjs';
import { ActorRefFrom, createMachine } from 'xstate';
import { selectAllPlayersConnected } from './trivia-jam.selectors';

export interface TriviaJamContext {
  room: Room<TriviaJamState>;
}
export type TriviaJamEvent = TriviaJamCommand;

export const createTriviaJamMachine = (room: Room<TriviaJamState>) => {
  // const state$ = fromRoom(room);

  const triviaJamMachine = createMachine(
    {
      id: 'TriviaJamMachine',
      initial: 'Initializing',
      context: {
        room,
      },
      schema: {
        context: {} as TriviaJamContext,
        events: {} as TriviaJamEvent,
      },
      states: {
        Initializing: {
          always: [
            {
              target: 'Playing',
              cond: 'allPlayersConnected',
            },
            {
              target: 'Waiting',
            },
          ],
        },
        Waiting: {
          on: {
            JOIN: {
              target: 'Playing',
              cond: 'allPlayersConnected',
            },
          },
          // invoke: {
          //   onDone: 'Playing',
          //   src: ({ room }) =>
          //     new Promise((resolve) => {
          //       console.log('checking if all players connected');
          //       if (selectAllPlayersConnected(room.state)) {
          //         resolve(null);
          //         return;
          //       }

          //       room.state.listen('players', (players) => {
          //         console.log('PLAYERS!');
          //         if (selectAllPlayersConnected(room.state)) {
          //           resolve(null);
          //         }
          //       });
          //     }),
          // },
        },
        Playing: {
          initial: 'AwaitingQuestion',
          states: {
            AwaitingQuestion: {
              on: {
                CONTINUE: 'Question',
              },
            },
            Question: {
              initial: 'Loading',
              states: {
                Loading: {
                  // invoke: {
                  //   id: 'loadNextQuestion',
                  //   src: 'loadNextQuestion',
                  //   onDone: {
                  //     target: 'Presenting',
                  //     // actions: assign<
                  //     //   TriviaJamSharedContext,
                  //     //   LoadNextQuestionDoneEvent
                  //     // >({
                  //     //   questions: ({ questions }, event) => [
                  //     //     ...questions,
                  //     //     event.data,
                  //     //   ],
                  //     // }),
                  //   },
                  // },
                },
                Presenting: {
                  // invoke: {
                  //   id: 'onShowQuestionPromptComplete',
                  //   src: 'onShowQuestionPromptComplete',
                  //   onDone: 'Responding',
                  // },
                },
                // Responding: {
                //   invoke: {
                //     id: 'onResponseComplete',
                //     src: 'onResponseComplete',
                //     onDone: 'Reviewing',
                //   },
                // },
                // Reviewing: {
                //   invoke: {
                //     id: 'onHostPressContinue',
                //     src: 'onHostPressContinue',
                //     onDone: 'Complete',
                //   },
                // },
                // Complete: {
                //   type: 'final' as const,
                // },
              },
            },
          },
        },
        GameOver: {},
      },
      predictableActionArguments: true,
    },
    {
      guards: {
        allPlayersConnected: ({ room }, event) => {
          if ('userId' in event) {
            const player = room.state.players.get(event.userId);
            console.log(player);
          }
          const res = selectAllPlayersConnected(room.state);
          // room.state.players.get(event.)
          console.log(
            'checking all players connected',
            // room.state.players,
            event
          );
          return res;
        },
      },
      actions: {},
    }
  );
  return triviaJamMachine;
};

// export function fromSetSchema<K extends SetSchema<any>(
//   schema: TriviaJamState
// ): Observable<TriviaJamState> {
//   return new Observable((subscriber) => {
//     subscriber.next(room.state);
//     room.state.onChange = (_) => {
//       console.log('on change', room.state);
//       subscriber.next(room.state);
//     };
//   });
// }

export function fromRoom<TState extends TriviaJamState>(
  room: Room<TState, unknown>
): Observable<TState> {
  return new Observable((subscriber) => {
    subscriber.next(room.state);
    room.state.onChange = (_) => {
      console.log('on change', room.state);
      subscriber.next(room.state);
    };
  });
}

type TriviaJamMachine = ReturnType<typeof createTriviaJamMachine>;
export type TriviaJamService = ActorRefFrom<TriviaJamMachine>;
