import { assertEventType } from '@explorers-club/utils';
import { ReactNode } from 'react';
import { ActorRefFrom, assign, createMachine, StateFrom } from 'xstate';

type ModalEvent = { type: 'SHOW'; component: ReactNode } | { type: 'CLOSE' };

type ModalContext = {
  activeComponent: ReactNode;
};

export const modalMachine = createMachine(
  {
    id: 'ModalMachine',
    initial: 'Unmounted',
    schema: {
      context: {} as ModalContext,
      events: {} as ModalEvent,
    },
    states: {
      Unmounted: {
        on: {
          SHOW: {
            target: 'Mounted',
            actions: 'setComponent',
          },
        },
      },
      Mounted: {
        on: {
          CLOSE: 'Unmounted',
        },
      },
    },
    predictableActionArguments: true,
  },
  {
    actions: {
      setComponent: assign<ModalContext, ModalEvent>({
        activeComponent: (_, event) => {
          assertEventType(event, 'SHOW');
          return event.component;
        },
      }),
    },
  }
);

export type ModalMachine = typeof modalMachine;
export type ModalActor = ActorRefFrom<ModalMachine>;
export type ModalState = StateFrom<ModalMachine>;
