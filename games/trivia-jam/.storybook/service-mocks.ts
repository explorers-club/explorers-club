import { assign, createMachine, DoneInvokeEvent } from 'xstate';

interface MockContext<T> {
  url: string;
  data?: T;
}

export function createMockFetchMachine<T>(data: T) {
  return createMachine({
    id: 'MockFetchMachine',
    initial: 'Loading',
    schema: {
      context: {} as MockContext<T>,
    },
    states: {
      Loading: {
        invoke: {
          src: async () => data,
          onDone: {
            target: 'Success',
            actions: assign<MockContext<T>, DoneInvokeEvent<T>>({
              data: (_, event: DoneInvokeEvent<T>) => event.data as T,
            }),
          },
        },
      },
      Success: {
        type: 'final' as const,
        data: ({ data }) => data,
      },
    },
  });
}
