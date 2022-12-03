import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';

const triviaJamPlayerModel = createModel(
  {
    playerName: '' as string,
  },
  {
    events: {
      CONTINUE: () => ({}),
    },
  }
);

export const TriviaJamPlayerEvents = triviaJamPlayerModel.events;
export type TriviaJamPlayerContext = ContextFrom<typeof triviaJamPlayerModel>;
export type TriviaJamPlayerEvent = EventFrom<typeof triviaJamPlayerModel>;

export const createTriviaJamPlayerMachine = () =>
  createMachine(
    {
      id: 'TriviaJamPlayer',
      schema: {
        context: {} as TriviaJamPlayerContext,
        events: {} as TriviaJamPlayerEvent,
      },
      type: 'parallel',
      states: {
        Ready: {
          initial: 'No',
          states: {
            No: {
              on: {
                CONTINUE: 'Yes',
              },
            },
            Yes: {},
          },
        },
        Connected: {
          initial: 'Yes',
          states: {
            Yes: {},
            No: {},
          },
        },
      },
      predictableActionArguments: true,
    },
    {}
  );

export type TriviaJamPlayerMachine = ReturnType<
  typeof createTriviaJamPlayerMachine
>;

export type TriviaJamPlayerActor = ActorRefFrom<TriviaJamPlayerMachine>;
export type TriviaJamPlayerState = StateFrom<TriviaJamPlayerMachine>;
