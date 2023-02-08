import {
  LittleVigilanteCommand,
  LittleVigilanteServerEvent,
  LittleVigilanteStateSerialized,
} from '@explorers-club/room';
import { Args, DecoratorFunction } from '@storybook/csf';
import { ReactFramework } from '@storybook/react';
import { Subject } from 'rxjs';
import { LittleVigilanteContext } from '../state/little-vigilante.context';

// todo hoist out to common
function createMockStore<TState, TCommand>({ state }: { state: TState }) {
  return {
    id: 'mockStore',
    send: (command: TCommand) => {
      console.log('mock send', command);
    },
    getSnapshot: () => {
      return state;
    },
    subscribe: (onStoreChange: (state: TState) => void) => {
      // no-op
      return () => {
        // no-op
      };
    },
  };
}

export const withLittleVigilanteContext: DecoratorFunction<
  ReactFramework,
  Args
> = (Story, context) => {
  const { state, myUserId } = context.args as unknown as {
    myUserId: string;
    state: LittleVigilanteStateSerialized;
  };

  const event$ = new Subject<LittleVigilanteServerEvent>();

  context.parameters['event$'] = event$;

  const store = createMockStore<
    LittleVigilanteStateSerialized,
    LittleVigilanteCommand
  >({ state });

  return (
    <LittleVigilanteContext.Provider value={{ store, myUserId, event$ }}>
      <Story />
    </LittleVigilanteContext.Provider>
  );
};

export type LittleVigilanteMockState = {
  myUserId: string;
  state: Partial<LittleVigilanteStateSerialized>;
};
