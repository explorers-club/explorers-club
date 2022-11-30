import { ActorID, SharedCollectionActor } from '@explorers-club/actor';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { TriviaJamSharedEvents } from './trivia-jam-shared.machine';

interface CreateProps {
  sharedCollectionActor: SharedCollectionActor;
  sharedActorId: ActorID;
}

export interface TriviaJamServerContext {
  questionSetEntryId: string;
}

/**
 * The lobby servermachine mimics the state of the shared state, but
 * actually runs the logic behind it using services
 * @param
 * @returns
 */
export const createTriviaJamServerMachine = ({
  sharedCollectionActor,
  sharedActorId,
}: CreateProps) => {

  // return createMachine({
  //   id: "TriviaJamServerMachine",
  //   initial: "Initialize",
  //   states: {
  //     Initialize: {
  //       invoke: {
  //         src: 
  //       }
  //     }
  //   }
  // })
  // const selectSharedActor = createActorByIdSelector(sharedActorId);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // const sharedActor = selectSharedActor(sharedCollectionActor.getSnapshot()!);
  // const initial = sharedActor?.getSnapshot()?.value;

  // return createMachine({
  //   id: 'TriviaJamServerMachine',
  //   initial: 'Initializing',
  //   schema: {
  //     context: {} as TriviaJamServerContext,
  //   },
  //   states: {
  //     Staging: {
  //       invoke: {
  //         src: 'waitForAllPlayersReady',
  //         onDone: 'Playing',
  //       },
  //     },
  //     Playing: {},
  //   },
  //   predictableActionArguments: true,
  // });
};

export type TriviaJamServerMachine = ReturnType<
  typeof createTriviaJamServerMachine
>;
export type TriviaJamServerActor = ActorRefFrom<TriviaJamServerMachine>;
export type TriviaJamServerState = StateFrom<TriviaJamServerMachine>;
