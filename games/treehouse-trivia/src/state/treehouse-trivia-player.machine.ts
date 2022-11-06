import { SharedMachineProps } from '@explorers-club/actor';
import { ActorRefFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const treehouseTriviaPlayerModel = createModel(
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

export const TreehouseTriviaPlayerEvents = treehouseTriviaPlayerModel.events;

export const createTreehouseTriviaPlayerMachine = ({
  actorId,
}: SharedMachineProps) =>
  treehouseTriviaPlayerModel.createMachine(
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

export type TreehouseTriviaPlayerMachine = ReturnType<
  typeof createTreehouseTriviaPlayerMachine
>;
export type TreehouseTriviaPlayerState =
  StateFrom<TreehouseTriviaPlayerMachine>;
export type TreehouseTriviaPlayerActor =
  ActorRefFrom<TreehouseTriviaPlayerMachine>;
