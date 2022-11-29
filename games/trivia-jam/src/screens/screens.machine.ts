import { SharedCollectionActor } from '@explorers-club/actor';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import { TriviaJamSharedActor } from '../state';
import { createQuestionScreenMachine } from './question/question-screen.machine';

interface ScreensMachineContext {
  sharedCollectionActor: SharedCollectionActor;
  triviaJamSharedActor: TriviaJamSharedActor;
}

export const screensMachine = createMachine({
  id: 'TriviaJamScreensMachine',
  initial: 'Introduction',
  schema: {
    context: {} as ScreensMachineContext,
    events: {} as { type: 'NEXT_QUESTION'; questionId: string },
  },
  states: {
    Introduction: {
      invoke: {
        src: async ({ triviaJamSharedActor }) => {
          waitFor(triviaJamSharedActor, (state) => state.matches('Playing'), {
            timeout: 9999999,
          });
        },
        onDone: 'Scoreboard',
      },
    },
    Scoreboard: {
      invoke: {
        src: async ({ triviaJamSharedActor }) => {
          // TODO refactor to use observable so it doesnt timeout
          waitFor(
            triviaJamSharedActor,
            (state) => !state.matches('AwaitingQuestion'),
            {
              timeout: 9999999,
            }
          );
        },
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
