import { SharedMachineProps } from '@explorers-club/actor';
import { ActorRefFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const triviaJamPlayerModel = createModel(
  {},
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

export const createTriviaJamPlayerMachine = ({
  actorId,
}: SharedMachineProps) =>
  triviaJamPlayerModel.createMachine(
    {
      id: actorId,
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

export type TriviaJamPlayerMachine = ReturnType<
  typeof createTriviaJamPlayerMachine
>;
export type TriviaJamPlayerState =
  StateFrom<TriviaJamPlayerMachine>;
export type TriviaJamPlayerActor =
  ActorRefFrom<TriviaJamPlayerMachine>;
