import { ActorRefFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const gameScreenModel = createModel(
  {},
  {
    events: {
      FOO: () => ({}),
    },
  }
);

export const GameScreenEvents = gameScreenModel.events;

export const createGameScreenMachine = () => {
  return gameScreenModel.createMachine({
    id: 'GameScreenMachine',
    context: {},
    states: {},
    predictableActionArguments: true,
  });
};

export type GameScreenMachine = ReturnType<typeof createGameScreenMachine>;
export type GameScreenActor = ActorRefFrom<GameScreenMachine>;
export type GameScreenState = StateFrom<GameScreenMachine>;
