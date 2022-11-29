import { SharedMachineProps } from '@explorers-club/actor';
import { createModel } from 'xstate/lib/model';

const triviaJamPlayerModel = createModel(
  {
    playerName: '' as string,
  },
  {
    events: {
      PLAYER_PRESS_NEXT_QUESTION: () => ({}),
      PLAYER_PRESS_ANSWER: () => ({}),
      PLAYER_PRESS_CORRECT: () => ({}),
      PLAYER_PRESS_INCORRECT: () => ({}),
    },
  }
);

export const TriviaJamPlayerEvents = triviaJamPlayerModel.events;

export const createTriviaJamPlayerMachine = () =>
  triviaJamPlayerModel.createMachine(
    {
      id: 'TriviaJamPlayer',
      type: 'parallel',
      initial: 'Playing',
      states: {
        Playing: {
          // future handle disocnnect / reconnect logic here
        },
      },
      predictableActionArguments: true,
    },
    {}
  );
