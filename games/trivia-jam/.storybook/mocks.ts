import { createMachine } from 'xstate';

export function createMockFetchMachine<T>(data: T) {
  return createMachine({
    id: 'FakeFetchMachine',
    initial: 'Loading',
    schema: {
      context: {} as { url: string; data: T },
    },
    states: {
      Loading: {
        invoke: {
          src: async () => data,
          onDone: 'Success',
        },
      },
      Success: {
        type: 'final' as const,
      },
    },
  });
}
