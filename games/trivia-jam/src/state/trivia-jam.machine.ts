import {
  ActorID,
  fromActorEvents,
  SharedMachineProps,
} from '@explorers-club/actor';
import { map, first } from 'rxjs';
import { ActorRefFrom, assign, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

interface Props {
  playerActorIds: string[];
  hostId: string;
}

const triviaJamModel = createModel(
  {
    playerActorIds: [] as ActorID[],
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

export const TriviaJamEvents = triviaJamModel.events;

export const createTriviaJamMachine = ({
  actorId,
  actorManager,
}: SharedMachineProps) =>
  triviaJamModel.createMachine(
    {
      id: actorId,
      initial: 'Unitialized',
      states: {
        Unitialized: {
          on: {
            INITIALIZE: {
              actions: assign({
                playerActorIds: (_, event) => event.playerActorIds,
                hostId: (_, event) => event.hostId,
                correctCounts: (_, event) =>
                  event.playerActorIds.reduce((result, cur) => {
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
        Playing: {
          states: {
            AwaitingQuestion: {
              invoke: {
                src: (context, event) =>
                  fromActorEvents(actorManager, [
                    'PLAYER_PRESS_NEXT_QUESTION',
                  ]).pipe(
                    // do this map because xstate expects observable to run an event with a type
                    map((data) => data.event),
                    first()
                  ),
                onDone: 'AwaitingResponse',
              },
            },
            AwaitingResponse: {
              invoke: {
                src: (context, event) =>
                  fromActorEvents(actorManager, ['PLAYER_PRESS_ANSWER']).pipe(
                    map((data) => data.event),
                    first()
                  ),
                onDone: 'AwaitingJudgement',
              },
            },
            AwaitingJudgement: {
              invoke: {
                src: (context, event) =>
                  fromActorEvents(actorManager, [
                    'PLAYER_PRESS_CORRECT',
                    'PLAYER_PRESS_INCORRECT',
                  ]).pipe(
                    map(({ event, actorId }) => ({
                      ...event,
                      actorId,
                    })),
                    first()
                  ),
                onDone: [
                  {
                    target: 'AwaitingResponse',
                    cond: (cond, event) =>
                      event.type === 'PLAYER_PRESS_INCORRECT',
                  },
                  { target: 'AwaitingQuestion' },
                ],
              },
            },
          },
        },
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

export type TriviaJamMachine = ReturnType<
  typeof createTriviaJamMachine
>;
export type TriviaJamActor = ActorRefFrom<TriviaJamMachine>;
export type TriviaJamState = StateFrom<TriviaJamMachine>;
