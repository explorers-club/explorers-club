import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { createIntroductionScreenMachine } from './introduction/introduction-screen.machine';

export const screensMachine = createMachine({
  id: 'TriviaJamScreensMachine',
  initial: 'Introduction',
  states: {
    Introduction: {
      invoke: {
        src: () => createIntroductionScreenMachine(),
        onDone: 'AwaitingQuestion',
      },
    },
    AwaitingQuestion: {
      invoke: {
        src: 'waitForQuestion',
      },
    },
  },
});

type ScreensMachine = typeof screensMachine;
export type ScreensActor = ActorRefFrom<ScreensMachine>;
export type ScreensState = StateFrom<ScreensMachine>;
