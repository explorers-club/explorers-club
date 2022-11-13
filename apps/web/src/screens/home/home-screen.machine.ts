import { ActorRefFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const homeScreenModel = createModel(
  {},
  {
    events: {
      FOO: () => ({}),
    },
  }
);

export const HomeScreenEvents = homeScreenModel.events;

export const createHomeScreenMachine = () => {
  return homeScreenModel.createMachine({
    id: 'HomeScreenMachine',
    context: {},
    type: 'parallel',
    states: {
      Footer: {},
      Header: {},
    },
    predictableActionArguments: true,
  });
};

export type HomeScreenMachine = ReturnType<typeof createHomeScreenMachine>;
export type HomeScreenActor = ActorRefFrom<HomeScreenMachine>;
export type HomeScreenState = StateFrom<HomeScreenMachine>;
