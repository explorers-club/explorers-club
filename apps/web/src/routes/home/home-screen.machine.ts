import { PartiesTable } from '@explorers-club/database';
import { ActorRefFrom, assign, DoneInvokeEvent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { supabaseClient } from '../../lib/supabase';

const homeScreenModel = createModel(
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

export const HomeScreenEvents = homeScreenModel.events;

export const homeScreenMachine = homeScreenModel.createMachine(
  {
    id: 'homeScreenMachine',
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
            target: 'Complete',
          },
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
        data: (context) => context.partyRow, // Empty if starting a new one
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
      joinParty: async (context, event) => {
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

export type HomeScreenActor = ActorRefFrom<typeof homeScreenMachine>;
