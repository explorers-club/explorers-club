import { ActorRefFrom, ContextFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import type { ECSupabaseClient } from '@explorers-club/database';

const partyModel = createModel(
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

export type PartyContext = ContextFrom<typeof partyModel>;

export const createPartyServerMachine = (
  context: PartyContext,
  supabaseClient: ECSupabaseClient
) => {
  return partyModel.createMachine(
    {
      id: `PartyServerMachine-${context.id}`,
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

// export const createPartyClientMachine = (id: string) => {
//   return partyModel.createMachine({
//     id: `PartyClientMachine-${id}`,
//     initial: 'Initializing',
//     context: {
//       id,
//     },
//     states: {
//       Initializing: {},
//     },
//   });
// };

type PartyMachine = ReturnType<typeof createPartyServerMachine>;
export type PartyActor = ActorRefFrom<PartyMachine>;
