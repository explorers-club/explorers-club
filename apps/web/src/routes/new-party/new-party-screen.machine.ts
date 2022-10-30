import { PartiesTable } from '@explorers-club/database';
import { assign, DoneInvokeEvent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { supabaseClient } from '../../lib/supabase';
import { AuthActor } from '../../state/auth.machine';
import { createAnonymousUser } from '../../state/auth.utils';

const newPartyScreenModel = createModel({
  partyRow: undefined as PartiesTable['Row'] | undefined,
});

interface CreateMachineProps {
  authActor: AuthActor;
}

export const createNewPartyScreenMachine = ({
  authActor,
}: CreateMachineProps) =>
  newPartyScreenModel.createMachine(
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
      predictableActionArguments: true,
    },
    {
      services: {
        startParty: async (_) => {
          await createAnonymousUser(authActor);

          // Only place were using supbase currently
          // The join code generation is in postgresql code
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
