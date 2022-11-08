import { ActorRefFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { AuthActor } from '../../state/auth.machine';

const clubScreenModel = createModel(
  {
    //     playerName: undefined as string | undefined,
    //     actorManager: {} as ActorManager,
    //     partyActor: undefined as PartyActor | undefined,
    //     myActor: undefined as PartyPlayerActor | undefined,
    //     authActor: {} as AuthActor,
  },
  {
    events: {
      //       INPUT_CHANGE_PLAYER_NAME: (value: string) => ({ playerName: value }),
      //       PRESS_SUBMIT: () => ({}),
      //       PRESS_JOIN: () => ({}),
    },
  }
);

interface CreateMachineProps {
  playerName: string;
  authActor: AuthActor;
}

export const createClubScreenMachine = ({
  playerName,
  authActor,
}: CreateMachineProps) => {
  // What network calls needs to happen?
  // Fetch to see if this profile has been claimed before
  // We can do that with useQuery and firebase I think
  return clubScreenModel.createMachine({
    initial: 'Connecting',
    states: {
      Connecting: {},
      Connected: {},
    },
  });
};

export type ClubScreenActor = ActorRefFrom<
  ReturnType<typeof createClubScreenMachine>
>;
