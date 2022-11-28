import { ActorRefFrom, createMachine, StateFrom } from 'xstate';

interface ClosestValueQuestionData {
  type: 'ClosestValue';
  question: string;
  answer: number;
}

interface FreeResponseQuestionData {
  type: 'FreeResponse';
  question: string;
  answer: string;
}

type QuestionData = ClosestValueQuestionData | FreeResponseQuestionData;

export interface QuestionScreenContext {
  questionId: string;
  data?: QuestionData;
}

export const createQuestionScreenMachine = (questionId: string) => {
  return createMachine({
    id: 'QuestionMachine',
    initial: 'Loading',
    context: {
      questionId,
    },
    predictableActionArguments: true,
    schema: {
      context: {} as QuestionScreenContext,
    },
    states: {
      Loading: {
        invoke: {
          src: 'fetchQuestion',
          data: {
            url: ({ questionId }: QuestionScreenContext) => {
              return `https://api.explorers.club/content_types/questions/${questionId}`;
            },
          },
          onDone: 'ShowingQuestion',
        },
      },
      ShowingQuestion: {},
      ShowingAnswer: {},
    },
  });
};

export type QuestionScreenMachine = ReturnType<
  typeof createQuestionScreenMachine
>;
export type QuestionScreenActor = ActorRefFrom<QuestionScreenMachine>;
export type QuestionScreenState = StateFrom<QuestionScreenMachine>;
