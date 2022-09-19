import { PartiesTable } from '@explorers-club/database';
import { assign, DoneInvokeEvent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { createAnonymousUser } from '../../lib/auth';
import { supabaseClient } from '../../lib/supabase';

const newPartyScreenModel = createModel({
  partyRow: undefined as PartiesTable['Row'] | undefined,
});

export const newPartyScreenMachine = newPartyScreenModel.createMachine(
  {
    id: 'NewPartyScreen',
    initial: 'Loading',
    states: {
      Loading: {
        invoke: {
          src: 'startParty',
          onDone: {
            target: 'Complete',
            actions: assign({
              partyRow: (_, event: DoneInvokeEvent<PartiesTable['Row']>) =>
                event.data,
            }),
          },
          onError: 'NetworkError',
        },
      },
      Complete: {
        type: 'final' as const,
        data: (context) => context.partyRow,
      },
      NetworkError: {},
    },
  },
  {
    services: {
      startParty: async (context, event) => {
        await createUserIfNotExists();

        const { data, error } = await supabaseClient
          .from('parties')
          .insert({ is_public: true })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }
        if (!data) {
          throw new Error('unexpected no data');
        }

        return data;
      },
    },
  }
);

const createUserIfNotExists = async () => {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    throw new Error(error.message);
  }

  let user = data.session?.user;
  if (!user) {
    user = await createAnonymousUser();
  }
  return user;
};
