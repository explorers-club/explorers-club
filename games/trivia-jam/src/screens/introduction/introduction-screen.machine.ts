import { ActorRefFrom, createMachine, StateFrom } from 'xstate';

export const createIntroductionScreenMachine = () => {
  return createMachine(
    {
      id: 'IntroductionMachine',
      initial: 'Loading',
      states: {
        Loading: {
          onDone: 'Playing',
        },
        Playing: {
          onDone: 'Complete',
        },
        Complete: {
          entry: 'logIntroComplete',
        },
      },
    },
    {
      actions: {
        logIntroComplete: () => {
          console.log('intro complete');
        },
      },
    }
  );
};

export type IntroductionScreenMachine = ReturnType<
  typeof createIntroductionScreenMachine
>;
export type IntroductionScreenActor = ActorRefFrom<IntroductionScreenMachine>;
export type IntroductionScreenState = StateFrom<IntroductionScreenMachine>;
