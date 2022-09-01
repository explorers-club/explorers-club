import { User } from '@supabase/supabase-js';
import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { supabaseClient } from '../lib/supabase';

// Connect to supabase channel

export const partyModel = createModel(
  {
    code: undefined as string | undefined,
  },
  {
    events: {
      JOIN: (code: string) => ({ code }),
      NOT_READY: () => ({}),
      READY: () => ({}),
      LEAVE: () => ({}),
    },
  }
);

export const partyMachine = createMachine(
  {
    id: 'partyMachine',
    context: partyModel.initialContext,
    type: 'parallel',
    states: {
      Connection: {
        initial: 'Disconnected',
        states: {
          Disconnected: {
            on: {
              JOIN_PARTY: 'Connecting',
            },
          },
          Connecting: {
            invoke: {
              src: 'joinParty',
              onDone: 'Connected',
              onError: 'Error',
            },
          },
          Connected: {},
          Error: {},
        },
      },
      Ready: {
        initial: 'No',
        states: {
          Yes: {},
          No: {},
        },
      },
    },
  },
  {
    services: {
      joinParty: async (context, event) => {
        console.log('joining party', context.code);
        const channel = supabaseClient.channel(`party-${context.code}`);
        channel
          .on('presence', { event: 'sync' }, () => {
            channel.presenceState();
          })
          .subscribe(async (status: unknown) => {
            console.log(status);
          });

        // const party = supabaseClient
        //   .from('parties')
        //   .select('*')
        //   .eq('code', context.code)
        //   .single();
        // How do I connect to the party?

        // const channel = supabaseClient.channel(`party-${context.code}`, {
        //   config: {
        //     presence: { key: context.me.id },
        //   },
        // });

        // channel
        //   .on('presence', { event: 'sync' }, () => {
        //     console.log(channel.presenceState());
        //   })
        //   .subscribe();

        // // TODO connect to supabase room
        // return 'cool';
      },
    },
  }
);

export type PartyContext = ContextFrom<typeof partyModel>;
export type PartyEvent = EventFrom<typeof partyModel>;
export type PartyActor = ActorRefFrom<typeof partyMachine>;
export type PartyState = StateFrom<typeof partyMachine>;

export default partyMachine;
