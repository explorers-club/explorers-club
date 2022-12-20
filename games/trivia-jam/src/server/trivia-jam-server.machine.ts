import { QuestionResponse, TriviaJamCommand } from '@explorers-club/commands';
import {
  IMultipleAnswerFields,
  IMultipleChoiceFields,
  INumberInputFields,
  IQuestionSetFields,
  ITextInputFields,
  ITrueOrFalseFields,
} from '@explorers-club/contentful-types';
import { TriviaJamState } from '@explorers-club/schema-types/TriviaJamState';
import { assertEventType } from '@explorers-club/utils';
import { Room } from 'colyseus';
import { Observable } from 'rxjs';
import { ActorRefFrom, assign, createMachine } from 'xstate';
import { selectAllPlayersConnected } from '../state/trivia-jam.selectors';
import { IQuestion } from '../types';
import { unwrapFields } from '../utils';

type Questions = IQuestionSetFields['questions'];

export interface TriviaJamServerContext {
  room: Room<TriviaJamState>;
  questions: Questions;
  currentQuestionIndex: number;
}
export type TriviaJamServerEvent = TriviaJamCommand;

export const createTriviaJamServerMachine = (
  room: Room<TriviaJamState>,
  questions: Questions
) => {
  const triviaJamMachine = createMachine(
    {
      id: 'TriviaJamServerMachine',
      initial: 'Initializing',
      context: {
        room,
        questions,
        currentQuestionIndex: -1,
      },
      schema: {
        context: {} as TriviaJamServerContext,
        events: {} as TriviaJamServerEvent,
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
          onDone: 'GameOver',
          states: {
            AwaitingQuestion: {
              on: {
                CONTINUE: {
                  target: 'Question',
                  // TODO only do this if we have questions remaining
                  actions: assign<TriviaJamServerContext>({
                    currentQuestionIndex: ({ currentQuestionIndex }) =>
                      currentQuestionIndex + 1,
                  }),
                },
              },
            },
            Question: {
              initial: 'Presenting',
              entry: ['setCurrentQuestionEntryId'],
              onDone: [
                {
                  target: 'AwaitingQuestion',
                  cond: 'hasMoreQuestions',
                },
                {
                  target: 'OutOfQuestions',
                },
              ],
              states: {
                Presenting: {
                  on: {
                    TRIVIA_JAM_SUBMIT_RESPONSE: {
                      actions: 'setPlayerResponse',
                    },
                    CONTINUE: 'Reviewing',
                  },
                },
                Reviewing: {
                  entry: 'judgeResponse',
                  on: {
                    CONTINUE: 'Complete',
                  },
                },
                Complete: {
                  entry: 'updatePointTotals',
                  exit: ['clearCurrentQuestionPoints', 'clearCurrentResponses'],
                  type: 'final' as const,
                },
              },
            },
            OutOfQuestions: {
              type: 'final' as const,
            },
          },
        },
        GameOver: {},
      },
      predictableActionArguments: true,
    },
    {
      guards: {
        hasMoreQuestions: ({ questions, currentQuestionIndex }) =>
          currentQuestionIndex < questions.length - 1,
        allPlayersConnected: ({ room }, event) =>
          selectAllPlayersConnected(room.state),
      },
      actions: {
        setPlayerResponse: ({ room }, event) => {
          assertEventType(event, 'TRIVIA_JAM_SUBMIT_RESPONSE');

          room.state.currentResponsesSerialized.set(
            event.userId,
            JSON.stringify(event.response)
          );
        },
        updatePointTotals: ({ room }) => {
          room.state.players.forEach((player) => {
            player.score =
              player.score + room.state.currentQuestionPoints[player.userId];
          });
        },
        judgeResponse: ({ room, questions, currentQuestionIndex }) => {
          const responses = Array.from(
            room.state.currentResponsesSerialized.entries()
          );
          const question = questions[currentQuestionIndex];

          responses.forEach(([userId, responseSerialized]) => {
            const response =
              responseSerialized &&
              (JSON.parse(responseSerialized) as QuestionResponse);
            const points = scoreResponse(question, response);
            room.state.currentQuestionPoints.set(userId, points);
          });
        },
        clearCurrentQuestionPoints: ({ room }) => {
          room.state.currentQuestionPoints.clear();
        },
        clearCurrentResponses: ({ room }) => {
          room.state.currentResponsesSerialized.clear();
        },
        setCurrentQuestionEntryId: ({ room, currentQuestionIndex }) => {
          room.state.currentQuestionEntryId =
            questions[currentQuestionIndex].sys.id;
        },
      },
    }
  );
  return triviaJamMachine;
};

const scoreResponse = (question: IQuestion, response: QuestionResponse) => {
  const contentType = question.sys.contentType.sys.id;

  switch (contentType) {
    case 'multipleAnswer':
      return scoreMultipleAnswer(
        unwrapFields<IMultipleAnswerFields>(question, 'multipleAnswer'),
        response as string[] | undefined
      );
    case 'multipleChoice':
      return scoreMultipleChoice(
        unwrapFields<IMultipleChoiceFields>(question, 'multipleChoice'),
        response as string | undefined
      );

    case 'trueOrFalse':
      return scoreTrueOrFalse(
        unwrapFields<ITrueOrFalseFields>(question, 'trueOrFalse'),
        response as boolean | undefined
      );

    case 'numberInput':
      return scoreNumberInput(
        unwrapFields<INumberInputFields>(question, 'numberInput'),
        response as number | undefined
      );

    case 'textInput':
      // TODO maybe add a way to for judge to be able to mark
      return scoreTextInput(
        unwrapFields<ITextInputFields>(question, 'textInput'),
        response as string | undefined
      );

    default:
      console.warn(
        `couldn't find scoreing logic for content type ${contentType}`
      );
      return 0;
  }
};

const scoreMultipleAnswer = (
  fields: IMultipleAnswerFields,
  response: string[]
) => {
  const matchedCorrectAnswers = fields.correctAnswers.filter((answer) => {
    return response.includes(answer);
  }).length;
  const matchedIncorrectAnswers = fields.incorrectAnswers.filter((answer) => {
    return !response.includes(answer);
  }).length;
  return matchedCorrectAnswers + matchedIncorrectAnswers;
};

const scoreMultipleChoice = (
  fields: IMultipleChoiceFields,
  response: string | undefined
) => {
  return fields.correctAnswer === response ? 1 : 0;
};

const scoreTrueOrFalse = (
  fields: ITrueOrFalseFields,
  response: boolean | undefined
) => {
  return fields.answer === response ? 1 : 0;
};

const scoreNumberInput = (
  fields: INumberInputFields,
  response: number | undefined
) => {
  return fields.correctValue === response ? 1 : 0;
};

const scoreTextInput = (
  fields: ITextInputFields,
  response: string | undefined
) => {
  return fields.correctAnswer === response ? 1 : 0;
};

export function fromRoom<TState extends TriviaJamState>(
  room: Room<TState, unknown>
): Observable<TState> {
  return new Observable((subscriber) => {
    subscriber.next(room.state);
    room.state.onChange = (_) => {
      subscriber.next(room.state);
    };
  });
}

type TriviaJamServerMachine = ReturnType<typeof createTriviaJamServerMachine>;
export type TriviaJamServerService = ActorRefFrom<TriviaJamServerMachine>;
