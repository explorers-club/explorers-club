import { assign } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { createAnonymousUser } from '../../lib/auth';
import { supabaseClient } from '../../lib/supabase';

const homeModel = createModel(
  {
    partyCode: '' as string,
  },
  {
    events: {
      INPUT_CHANGE_PARTY_CODE: (value: string) => ({ partyCode: value }),
      PRESS_JOIN_PARTY: () => ({}),
      PRESS_START_PARTY: () => ({}),
    },
  }
);

export const HOME_EVENTS = homeModel.events;

export const homeMachine = homeModel.createMachine(
  {
    id: 'homeMachine',
    initial: 'WaitingForInput',
    states: {
      WaitingForInput: {
        on: {
          INPUT_CHANGE_PARTY_CODE: {
            target: 'WaitingForInput',
            actions: assign({
              partyCode: (_, event) => {
                return event.partyCode;
              },
            }),
          },
          PRESS_JOIN_PARTY: {
            target: 'Fetching',
            cond: 'isJoinCodeValid',
          },
          PRESS_START_PARTY: {
            target: 'Creating',
          },
        },
      },
      Creating: {
        invoke: {
          src: 'createParty',
          onDone: 'Complete',
          onError: 'Error',
        },
      },
      Fetching: {
        invoke: {
          src: 'fetchParty',
          onDone: 'Complete',
          onError: 'Error',
        },
      },
      Error: {
        on: {
          INPUT_CHANGE_PARTY_CODE: {
            target: 'WaitingForInput',
            actions: assign({
              partyCode: (_, event) => event.partyCode,
            }),
          },
        },
      },
      Complete: {
        type: 'final' as const,
      },
    },
    predictableActionArguments: true,
  },
  {
    guards: {
      isJoinCodeValid: (context) => context.partyCode.length === 4,
    },
    services: {
      createParty: async (context, event) => {
        // TODO maybe a better way to check for being auth here
        // First create a user if you are not signed in...
        const { data: getSessionData, error: getSessionError } =
          await supabaseClient.auth.getSession();
        if (getSessionError) {
          throw new Error(getSessionError.message);
        }

        let user = getSessionData.session?.user;
        if (!user) {
          user = await createAnonymousUser();
        }

        const { data, error } = await supabaseClient
          .from('parties')
          .insert({ is_public: true });
        console.log('INSERT!', data, error);

        // const { data, error } = await supabaseClient
        //   .from('profiles')
        //   .update({ player_name: context.partyCode })
        //   .eq('user_id', user.id);

        // const code = crypto.randomUUID().slice(0, 4);
        // const res = await supabaseClient.from('parties').insert({ code });
        // return res;
        return data;

        // await supabaseClient.from('profiles').insert({ : 'Foo' });

        // Generate a random code
        // for now hope it's not currently in use
        // In future have backend generate code.
        // const code = crypto.randomUUID().slice(0, 4);
        // const { data, error } = await supabaseClient
        //   .from('parties')
        //   .insert([{ code: code }]);
        // console.log(data, error);
        // if (error) {
        //   throw new Error(error.message);
        // }
        // return data;
      },
      fetchparty: async (context, event) => {
        return await supabaseClient
          .from('parties')
          .select('*')
          .match({ code: context.partyCode })
          .single();
      },
    },
  }
);
