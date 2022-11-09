import { ActorRefFrom, assign, createMachine } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { fetchUserProfileByName } from '../../api/fetchUserProfileByName';
import { AuthActor } from '../../state/auth.machine';
import { createAnonymousUser } from '../../state/auth.utils';
import { createFormMachine } from '../../state/form.machine';
import { assertEventType } from '../../state/utils';

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
      INPUT_CHANGE_PHONE_NUMBER: (value: string) => ({ phoneNumber: value }),
      PRESS_CLAIM: () => ({}),
      PRESS_SUBMIT: () => ({}),
    },
  }
);

const enterPhoneNumberMachine = createFormMachine({
  handleSubmit: async (context, event) => {
    // TODO make network call here and figure if it we should return data or boolean
    return true
  }
})

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
      id: 'ClubScreenMachine',
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
                EnterPhoneNumber: {
                  invoke: {
                    src: enterPhoneNumberMachine,
                    onDone: 'VerifyPhoneNumber',
                  },
                },
                VerifyPhoneNumber: {},
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
        isPhoneNumberValid: (_, event) => {
          assertEventType(event, 'INPUT_CHANGE_PHONE_NUMBER');
          return (
            event.phoneNumber.length === 10 &&
            !!event.phoneNumber.match(/^[0-9]+$/)
          );
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
