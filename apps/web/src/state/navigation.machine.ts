import { PartiesRow } from '@explorers-club/database';
import { NavigateFunction } from 'react-router-dom';
import { ActorRefFrom, ContextFrom, DoneInvokeEvent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { homeMachine } from '../routes/home/home.machine';

const navigationModel = createModel({}, {});
export type NavigationContext = ContextFrom<typeof navigationModel>;

interface CreateNavigationMachineProps {
  initial: string;
  navigate: NavigateFunction;
}

const partyModel = createModel({});

const partyMachine = partyModel.createMachine({
  initial: 'WaitingForInput',
  states: {
    WaitingForInput: {},
  },
});

export const createNavigationMachine = ({
  initial,
  navigate,
}: CreateNavigationMachineProps) => {
  return navigationModel.createMachine({
    id: 'NavigationMachine',
    initial,
    states: {
      Home: {
        invoke: {
          id: 'homeMachine',
          src: homeMachine,
          onDone: {
            target: 'Party',
            actions: (context, event: DoneInvokeEvent<PartiesRow>) => {
              const code = event.data.join_code;
              if (!code) {
                throw new Error('no join code on party');
              }
              navigate(`/party/${code}`);
            },
          },
        },
      },
      Party: {
        invoke: {
          id: 'partyMachine',
          src: partyMachine,
        },
      },
    },
    predictableActionArguments: true, // from xstate v4 warning
  });
};

type NavigationMachine = ReturnType<typeof createNavigationMachine>;
export type NavigationActor = ActorRefFrom<NavigationMachine>;
// export type NavigationState = StateFrom<NavigationMachine>;
