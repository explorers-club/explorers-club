import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { createIntroductionScreenMachine } from './introduction/introduction-screen.machine';
import { createQuestionScreenMachine } from './question/question-screen.machine';
import { createScoreboardScreenMachine } from './scoreboard/scoreboard-screen.machine';

export const screensMachine = createMachine({
  id: 'TriviaJamScreensMachine',
  initial: 'Introduction',
  schema: {
    events: {} as { type: 'NEXT_QUESTION'; questionId: string },
  },
  states: {
    Introduction: {
      invoke: {
        src: () => createIntroductionScreenMachine(),
        onDone: 'Scoreboard',
      },
    },
    Scoreboard: {
      invoke: {
        src: () => createScoreboardScreenMachine(),
      },
    },
    Question: {
      invoke: {
        src: () => createQuestionScreenMachine('foo'),
      },
    },
  },
});

type ScreensMachine = typeof screensMachine;
export type ScreensActor = ActorRefFrom<ScreensMachine>;
export type ScreensState = StateFrom<ScreensMachine>;
