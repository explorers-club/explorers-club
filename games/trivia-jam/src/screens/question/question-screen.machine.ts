import { ActorRefFrom, createMachine, StateFrom } from 'xstate';

export const createQuestionScreenMachine = () => {
  return createMachine(
    {
      id: 'QuestionMachine',
      initial: 'Loading',
      states: {
        Loading: {},
        ShowingQuestion: {
          onDone: 'ShowingAnswer',
        },
        ShowingAnswer: {},
      },
    },
    {}
  );
};

export type QuestionScreenMachine = ReturnType<
  typeof createQuestionScreenMachine
>;
export type QuestionScreenActor = ActorRefFrom<QuestionScreenMachine>;
export type QuestionScreenState = StateFrom<QuestionScreenMachine>;
