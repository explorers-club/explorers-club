import { ActorRefFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const unclaimedScreenModel = createModel(
  {},
  {
    events: {
      FOO: () => ({}),
    },
  }
);

export const UnclaimedScreenEvents = unclaimedScreenModel.events;

export const createUnclaimedScreenMachine = () => {
  return unclaimedScreenModel.createMachine({
    id: 'UnclaimedScreenMachine',
    context: {},
    states: {},
    predictableActionArguments: true,
  });
};

export type UnclaimedScreenMachine = ReturnType<
  typeof createUnclaimedScreenMachine
>;
export type UnclaimedScreenActor = ActorRefFrom<UnclaimedScreenMachine>;
export type UnclaimedScreenState = StateFrom<UnclaimedScreenMachine>;
