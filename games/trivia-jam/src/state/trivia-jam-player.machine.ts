import { createMachine } from 'xstate';

// const triviaJamPlayerModel = createModel(
//   {
//     playerName: '' as string,
//   },
//   {
//     events: {},
//   }
// );

// export const TriviaJamPlayerEvents = triviaJamPlayerModel.events;
interface TriviaJamPlayerContext {
  playerName: string;
}

export const createTriviaJamPlayerMachine = () =>
  createMachine(
    {
      id: 'TriviaJamPlayer',
      schema: {
        context: {} as TriviaJamPlayerContext,
      },
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
