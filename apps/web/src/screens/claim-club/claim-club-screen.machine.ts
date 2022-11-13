import { ActorRefFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { waitFor } from 'xstate/lib/waitFor';
import { AuthActor } from '../../state/auth.machine';
import { selectAuthIsInitalized } from '../../state/auth.selectors';
import { createAnonymousUser } from '../../state/auth.utils';
import { enterEmailMachine } from './enter-email.machine';

const claimClubScreenModel = createModel(
  {
    playerName: '' as string,
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
      },
      states: {
        Initializing: {
          invoke: {
            src: () => waitFor(authActor, selectAuthIsInitalized),
            onDone: [
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
        Error: {},
        EnteringEmail: {
          invoke: {
            src: enterEmailMachine,
            onDone: 'EnteringPassword',
            onError: 'Error',
          },
          // invoke: {
          //   src: enterEmailMachine,
          //   onDone: 'EnterPassword',
          //   onError: 'Error',
          // },
        },
        EnteringPassword: {},
      },
      predictableActionArguments: true,
    },
    {
      actions: {},
      guards: {
        isNotLoggedIn: () => {
          const session = authActor.getSnapshot()?.context.session;
          return !session;
        },
        isAnonymous: () => {
          return !!authActor
            .getSnapshot()
            ?.context.session?.user.email?.match('@anon-users.explorers.club');
        },
      },
      services: {
        createAccount: () => createAnonymousUser(authActor),
      },
    }
  );
};

export type ClaimClubScreenMachine = ReturnType<
  typeof createClaimClubScreenMachine
>;
export type ClaimClubScreenActor = ActorRefFrom<ClaimClubScreenMachine>;
export type ClaimClubScreenState = StateFrom<ClaimClubScreenMachine>;
