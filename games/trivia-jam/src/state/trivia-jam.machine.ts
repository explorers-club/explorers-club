import { TriviaJamCommand } from '@explorers-club/commands';
import { IQuestionSetFields } from '@explorers-club/contentful-types';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { Room } from 'colyseus';
import { Observable } from 'rxjs';
import { ActorRefFrom, assign, createMachine } from 'xstate';
import { selectAllPlayersConnected } from './trivia-jam.selectors';

type Questions = IQuestionSetFields['questions'];

export interface TriviaJamContext {
  room: Room<TriviaJamState>;
  questions: Questions;
  currentQuestionIndex: number;
}
export type TriviaJamEvent = TriviaJamCommand;

export const createTriviaJamMachine = (
  room: Room<TriviaJamState>,
  questions: Questions
) => {
  // const state$ = fromRoom(room);

  const triviaJamMachine = createMachine(
    {
      id: 'TriviaJamMachine',
      initial: 'Initializing',
      context: {
        room,
        questions,
        currentQuestionIndex: -1,
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
        },
        Playing: {
          initial: 'AwaitingQuestion',
          states: {
            AwaitingQuestion: {
              on: {
                CONTINUE: {
                  target: 'Question',
                  // TODO only do this if we have questions remaining
                  actions: assign<TriviaJamContext>({
                    currentQuestionIndex: ({ currentQuestionIndex }) =>
                      currentQuestionIndex + 1,
                  }),
                },
              },
            },
            Question: {
              initial: 'Presenting',
              entry: ({ room, questions, currentQuestionIndex }) => {
                room.state.currentQuestionEntryId =
                  questions[currentQuestionIndex].sys.id;
              },
              states: {
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
        allPlayersConnected: ({ room }, event) =>
          selectAllPlayersConnected(room.state),
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
