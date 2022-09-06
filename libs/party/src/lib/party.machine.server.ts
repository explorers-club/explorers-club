import type { ECSupabaseClient } from '@explorers-club/database';
import { ActorRefFrom, ContextFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const serverPartyModel = createModel(
  {
    id: '' as string,
    playerIds: [] as string[],
  },
  {
    events: {
      PLAYER_JOINED: (id: string) => ({ playerId: id }),
      PLAYER_CONNECTED: (id: string) => ({ playerId: id }),
      PLAYER_DISCONNECTED: (id: string) => ({ playerId: id }),
      PLAYER_READY: (id: string) => ({ playerId: id }),
    },
  }
);

export type ServerPartyContext = ContextFrom<typeof serverPartyModel>;

export const createPartyServerMachine = (
  context: ServerPartyContext,
  supabaseClient: ECSupabaseClient
) => {
  return serverPartyModel.createMachine(
    {
      id: `PartyMachineServer-${context.id}`,
      initial: 'Initializing',
      context,
      states: {
        Initializing: {
          invoke: {
            id: 'initialize',
            src: 'initialize',
            onDone: 'Initialized',
            onError: 'Error',
          },
        },
        Initialized: {},
        Error: {},
      },
      predictableActionArguments: true,
    },
    {
      services: {
        initialize: async (context) => {
          console.log('todo: setup supabase presence here');
          return 'todo';
        },
      },
    }
  );
};

type ServerPartyMachine = ReturnType<typeof createPartyServerMachine>;
export type ServerPartyActor = ActorRefFrom<ServerPartyMachine>;
