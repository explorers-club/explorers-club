import React, { createContext } from 'react';
import { createMachine } from 'xstate';
import { QuestionData, ProfileData } from './types';

function createFetchMachine<T>() {
  return createMachine({
    id: 'FetchMachine',
    initial: 'Loading',
    schema: {
      context: {} as { url: string; data: T },
    },
    states: {
      Loading: {
        invoke: {
          src: async ({ url }) => {
            return await fetch(url);
          },
          onDone: 'Success',
        },
      },
      Success: {
        type: 'final' as const,
      },
    },
  });
}

export const TriviaJamServices = createContext({
  fetchQuestion: createFetchMachine<QuestionData>(),
  fetchProfile: createFetchMachine<ProfileData>(),
});

export type TriviaJamServiceContext =
  typeof TriviaJamServices extends React.Context<infer U> ? U : never;
