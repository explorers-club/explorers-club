import { SharedMachineProps } from '@explorers-club/actor';
import { ActorRefFrom, assign, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

interface Props {
  playerUserIds: string[];
  hostId: string;
}

const treehouseTriviaModel = createModel(
  {
    playerUserIds: [] as string[],
    hostId: '' as string,
    correctCounts: {} as Record<string, number>,
  },
  {
    events: {
      INITIALIZE: (props: Props) => props,
      PLAYER_LOADED: () => ({}),
    },
  }
);

export const createTreehouseTriviaMachine = ({
  actorId,
}: SharedMachineProps) =>
  treehouseTriviaModel.createMachine(
    {
      id: actorId,
      initial: 'Unitialized',
      states: {
        Unitialized: {
          on: {
            INITIALIZE: {
              actions: assign({
                playerUserIds: (_, event) => event.playerUserIds,
                hostId: (_, event) => event.hostId,
                correctCounts: (_, event) =>
                  event.playerUserIds.reduce((result, cur) => {
                    return {
                      ...result,
                      [cur]: 0,
                    };
                  }, {}),
              }),
            },
          },
        },
        Loading: {
          invoke: {
            src: 'waitForAllPlayersLoaded',
          },
        },
        Playing: {},
        GameOver: {
          type: 'final' as const,
        },
      },
      predictableActionArguments: true,
    },
    {
      services: {
        waitForAllPlayersLoaded: (context) =>
          new Promise((resolve) => {
            setTimeout(resolve, 2500);
          }),
      },
    }
  );

export type TreehouseTriviaMachine = ReturnType<
  typeof createTreehouseTriviaMachine
>;
export type TreehouseTriviaActor = ActorRefFrom<TreehouseTriviaMachine>;
export type TreehouseTriviaState = StateFrom<TreehouseTriviaMachine>;
