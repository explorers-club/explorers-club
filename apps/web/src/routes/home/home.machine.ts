import { PartiesTable } from '@explorers-club/database';
import { ActorRefFrom, assign, DoneInvokeEvent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { createAnonymousUser } from '../../lib/auth';
import { supabaseClient } from '../../lib/supabase';

const homeRouteModel = createModel(
  {
    partyCode: '' as string,
    partyRow: undefined as PartiesTable['Row'] | undefined,
    inputErrorMessage: '' as string,
  },
  {
    events: {
      INPUT_CHANGE_PARTY_CODE: (value: string) => ({ partyCode: value }),
      PRESS_JOIN_PARTY: () => ({}),
      PRESS_START_PARTY: () => ({}),
    },
  }
);

export const HOME_ROUTE_EVENTS = homeRouteModel.events;

export const homeRouteMachine = homeRouteModel.createMachine(
  {
    id: 'homeMachine',
    initial: 'WaitingForInput',
    states: {
      WaitingForInput: {
        on: {
          INPUT_CHANGE_PARTY_CODE: {
            target: 'WaitingForInput',
            actions: ['assignPartyCode', 'clearError'],
          },
          PRESS_JOIN_PARTY: [
            {
              target: 'Joining',
              cond: 'isJoinCodeValid',
            },
            {
              target: 'WaitingForInput',
              actions: 'setValidationError',
            },
          ],
          PRESS_START_PARTY: {
            target: 'Starting',
          },
        },
      },
      Starting: {
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
      Joining: {
        invoke: {
          src: 'joinParty',
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
      NetworkError: {},
      Complete: {
        type: 'final' as const,
        data: (context) => context.partyRow,
      },
    },
    predictableActionArguments: true,
  },
  {
    actions: {
      clearError: assign({
        inputErrorMessage: (_) => '',
      }),
      setValidationError: assign({
        inputErrorMessage: (_) => 'code must be 4 characters',
      }),
      assignPartyCode: assign({
        partyCode: (_, event) => {
          if (event.type !== 'INPUT_CHANGE_PARTY_CODE') {
            throw new Error(
              `unhandled event type in action assign party code ${event.type}`
            );
          }
          return event.partyCode;
        },
      }),
    },
    guards: {
      isJoinCodeValid: (context) => context.partyCode.length === 4,
    },
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
      joinParty: async (context, event) => {
        console.log(context.partyCode);
        const party = await supabaseClient
          .from('parties')
          .select('*')
          .match({ code: context.partyCode })
          .single();

        return party;
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

export type HomeActor = ActorRefFrom<typeof homeRouteMachine>;
