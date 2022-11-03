import { ActorID, SharedMachineProps } from '@explorers-club/actor';
import { ActorRefFrom, assign, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

interface Props {
  userId: string;
}

const treehouseTriviaPlayerModel = createModel(
  {
    userId: '' as string,
  },
  {
    events: {
      INITIALIZE: (props: Props) => props,
      ANSWER: () => ({}),
      JUDGE_RESPONSE: (correct: boolean) => ({ correct }),
    },
  }
);

export const TreehouseTriviaPlayerEvents = treehouseTriviaPlayerModel.events;

export const getTreehouseTriviaPlayerActorId = (userId: string) =>
  `TreehouseTriviaPlayer-${userId}` as ActorID;

export const createTreehouseTriviaPlayerMachine = ({ actorId }: SharedMachineProps) =>
  treehouseTriviaPlayerModel.createMachine(
    {
      id: actorId,
      type: 'parallel',
      initial: 'Uninitialized',
      states: {
        Unitialized: {
          on: {
            INITIALIZE: {
              target: 'Loading',
              actions: assign({
                userId: (_, event) => event.userId,
              }),
            },
          },
        },
        Loading: {
          invoke: {
            src: 'waitUntilLoaded',
            onDone: 'Ready',
          },
        },
      },
      predictableActionArguments: true,
    },
    {}
  );

export type TreehouseTriviaPlayerMachine = ReturnType<typeof createTreehouseTriviaPlayerMachine>;
export type TreehouseTriviaPlayerState = StateFrom<TreehouseTriviaPlayerMachine>;
export type TreehouseTriviaPlayerActor = ActorRefFrom<TreehouseTriviaPlayerMachine>;
