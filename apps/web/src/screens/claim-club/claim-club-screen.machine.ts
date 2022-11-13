import { ActorRefFrom, assign, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { waitFor } from 'xstate/lib/waitFor';
import { supabaseClient } from '../../lib/supabase';
import { AuthActor } from '../../state/auth.machine';
import {
  selectAuthIsInitalized,
  selectHasPasswordSet,
  selectIsAnonymous,
  selectPlayerName,
} from '../../state/auth.selectors';
import { createAnonymousUser } from '../../state/auth.utils';
import { enterEmailMachine } from './enter-email.machine';
import { enterPasswordMachine } from './enter-password.machine';

const claimClubScreenModel = createModel(
  {
    playerName: '' as string,
    errorMessage: undefined as string | undefined,
  },
  {
    events: {
      FOO: () => ({}),
    },
  }
);

export const ClaimClubScreenEvents = claimClubScreenModel.events;

export const createClaimClubScreenMachine = ({
  playerName,
  authActor,
}: {
  playerName: string;
  authActor: AuthActor;
}) => {
  return claimClubScreenModel.createMachine(
    {
      id: 'ClaimClubScreenMachine',
      initial: 'Initializing',
      context: {
        playerName,
        errorMessage: undefined,
      },
      states: {
        Initializing: {
          invoke: {
            src: () => waitFor(authActor, selectAuthIsInitalized),
            onDone: [
              {
                target: 'Error',
                cond: 'hasClubAlready',
                actions: 'setAlreadyHasClubError',
              },
              {
                target: 'CreatingAccount',
                cond: 'isNotLoggedIn',
              },
              {
                target: 'EnteringEmail',
                cond: 'isAnonymous',
              },
              {
                target: 'EnteringPassword',
                cond: 'hasNoPassword',
              },
              {
                target: 'ClaimingName',
                // TODO add guard to only do this if not already claimed
              },
            ],
          },
        },
        CreatingAccount: {
          invoke: {
            src: 'createAccount',
            onDone: 'EnteringEmail',
            onError: 'Error',
          },
        },
        Error: {
          exit: 'clearError',
          after: {
            5000: 'Complete',
          },
        },
        EnteringEmail: {
          invoke: {
            src: enterEmailMachine,
            onDone: 'EnteringPassword',
            onError: 'Error',
          },
        },
        EnteringPassword: {
          invoke: {
            src: enterPasswordMachine,
            onDone: 'ClaimingName',
            onError: 'Error',
          },
        },
        ClaimingName: {
          invoke: {
            src: 'claimName',
            onDone: 'Complete',
            onError: 'Error',
          },
        },
        Complete: {
          type: 'final' as const,
          data: ({ playerName }) => ({
            playerName,
          }),
        },
      },
      predictableActionArguments: true,
    },
    {
      actions: {
        setAlreadyHasClubError: claimClubScreenModel.assign({
          errorMessage: () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const playerName = selectPlayerName(authActor.getSnapshot()!);
            return `You already own explorers.club/${playerName}`;
          },
        }),
        clearError: claimClubScreenModel.assign({
          errorMessage: () => undefined,
        }),
      },
      guards: {
        hasClubAlready: () => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const playerName = selectPlayerName(authActor.getSnapshot()!);
          return !!playerName;
        },
        isNotLoggedIn: () => {
          const session = authActor.getSnapshot()?.context.session;
          return !session;
        },
        isAnonymous: () => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return selectIsAnonymous(authActor.getSnapshot()!);
        },
        hasNoPassword: () => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return !selectHasPasswordSet(authActor.getSnapshot()!);
        },
      },
      services: {
        createAccount: () => createAnonymousUser(authActor),
        claimName: async ({ playerName }) => {
          const userId = authActor.getSnapshot()?.context.session?.user.id;
          if (!userId) {
            throw new Error(
              'tried to save player name without being logged in'
            );
          }

          const { error } = await supabaseClient
            .from('profiles')
            .update({ player_name: playerName })
            .eq('user_id', userId);

          if (error) {
            throw error;
          }

          return true;
        },
      },
    }
  );
};

export type ClaimClubScreenMachine = ReturnType<
  typeof createClaimClubScreenMachine
>;
export type ClaimClubScreenActor = ActorRefFrom<ClaimClubScreenMachine>;
export type ClaimClubScreenState = StateFrom<ClaimClubScreenMachine>;
