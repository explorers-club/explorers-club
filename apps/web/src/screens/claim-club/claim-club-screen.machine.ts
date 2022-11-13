import { ActorRefFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { waitFor } from 'xstate/lib/waitFor';
import { AuthActor } from '../../state/auth.machine';
import { selectAuthIsInitalized } from '../../state/auth.selectors';

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
                target: 'EnteringEmail',
                cond: 'isAnonymous',
              },
              {
                target: 'EnteringPassword',
              },
            ],
          },
        },
        EnteringEmail: {},
        EnteringPassword: {},
      },
      predictableActionArguments: true,
    },
    {
      actions: {},
      guards: {
        isAnonymous: () => {
          return !!authActor
            .getSnapshot()
            ?.context.session?.user.email?.match('@anon-users.explorers.club');
        },
      },
      services: {},
    }
  );
};

export type ClaimClubScreenMachine = ReturnType<
  typeof createClaimClubScreenMachine
>;
export type ClaimClubScreenActor = ActorRefFrom<ClaimClubScreenMachine>;
export type ClaimClubScreenState = StateFrom<ClaimClubScreenMachine>;
