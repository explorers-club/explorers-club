import { trpc } from '@explorers-club/api-client';
import { useState } from 'react';
import { assign, createMachine, StateFrom } from 'xstate';

export const useHomeMachine = () => {
  const { client } = trpc.useContext();
  const [homeMachine] = useState(
    createMachine({
      id: 'HomeMachine',
      initial: 'Idle',
      schema: {
        context: {} as { name?: string },
        events: {} as
          | { type: 'START_NEW' }
          | { type: 'SUBMIT_NAME'; name: string },
      },
      states: {
        Idle: {
          on: {
            START_NEW: {
              target: 'EnteringInfo',
            },
          },
        },
        EnteringInfo: {
          on: {
            SUBMIT_NAME: {
              target: 'StartingRoom',
              actions: assign({
                name: (context, event) => event.name,
              }),
            },
          },
        },
        StartingRoom: {
          invoke: {
            src: async ({ name }) => {
              if (!name) {
                throw new Error('Tried to save player name with no name set');
              }

              await client.profile.setPlayerName.mutate({ name });
              await client.room.start.mutate({ name });
            },
            onDone: 'Started',
          },
        },
        Started: {
          type: 'final',
          data: (context, event) => ({
            name: context.name,
          }),
        },
      },
    })
  );

  return homeMachine;
};

export type HomeState = StateFrom<ReturnType<typeof useHomeMachine>>;
