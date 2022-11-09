import { ActorRefFrom, DoneInvokeEvent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { AuthActor } from '../../state/auth.machine';
import { ProfilesRow } from '@explorers-club/database';
import { fetchUserProfileByName } from '../../api/fetchUserProfileByName';
import { createAnonymousUser } from '../../state/auth.utils';

const clubScreenModel = createModel(
  {
    hostPlayerName: '' as string,
    authActor: {} as AuthActor,
    // hostProfile: undefined as ProfilesRow | undefined,
    //     playerName: undefined as string | undefined,
    //     actorManager: {} as ActorManager,
    //     partyActor: undefined as PartyActor | undefined,
    //     myActor: undefined as PartyPlayerActor | undefined,
  },
  {
    events: {
      INPUT_CHANGE_PHONE_NUMBER: (value: string) => ({ playerName: value }),
      PRESS_CLAIM: () => ({}),
      //       INPUT_CHANGE_PLAYER_NAME: (value: string) => ({ playerName: value }),
      //       PRESS_SUBMIT: () => ({}),
      //       PRESS_JOIN: () => ({}),
    },
  }
);

export const ClubScreenEvents = clubScreenModel.events;

interface CreateMachineProps {
  hostPlayerName: string;
  authActor: AuthActor;
}

export const createClubScreenMachine = ({
  hostPlayerName,
  authActor,
}: CreateMachineProps) => {
  // What network calls needs to happen?
  // Fetch to see if this profile has been claimed before
  // We can do that with useQuery and firebase I think
  return clubScreenModel.createMachine(
    {
      initial: 'Loading',
      context: {
        authActor,
        hostPlayerName,
        // hostProfile: undefined,
      },
      states: {
        Loading: {
          invoke: {
            src: () => fetchUserProfileByName(hostPlayerName),
            onDone: 'Connecting', // todo persist data here?
            onError: 'Unclaimed',
          },
        },
        Unclaimed: {
          initial: 'Idle',
          states: {
            Idle: {
              on: {
                PRESS_CLAIM: 'Claiming',
              },
            },
            Claiming: {
              initial: 'Initializing',
              states: {
                Initializing: {
                  always: [
                    { target: 'CreateAccount', cond: 'isNotLoggedIn' },
                    { target: 'EnterPhoneNumber' },
                  ],
                },
                CreateAccount: {
                  invoke: {
                    src: 'createAccount',
                    onDone: 'EnterPhoneNumber',
                    onError: 'Error',
                  },
                },
                Error: {},
                EnterPhoneNumber: {},
              },
            },
          },
        },
        Connecting: {},
        Connected: {},
      },
    },
    {
      guards: {
        isNotLoggedIn: ({ authActor }, event) => {
          return !authActor.getSnapshot()?.context.session;
        },
      },
      services: {
        createAccount: ({ authActor }) => createAnonymousUser(authActor),
      },
    }
  );
};

export type ClubScreenActor = ActorRefFrom<
  ReturnType<typeof createClubScreenMachine>
>;
