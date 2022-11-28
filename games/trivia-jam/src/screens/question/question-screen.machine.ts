import {
  ActorRefFrom,
  assign,
  createMachine,
  DoneInvokeEvent,
  StateFrom,
} from 'xstate';

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
              // TODO create a machine for fetching from supabase instead of from URL
              return `https://api.explorers.club/content_types/questions/${questionId}`;
            },
          },
          onDone: {
            target: 'ShowingQuestion',
            actions: assign<
              QuestionScreenContext,
              DoneInvokeEvent<QuestionData>
            >({
              data: (_, event) => event.data,
            }),
          },
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
