import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { AuthActor } from '../../state/auth.machine';
import { assertEventType } from '../../state/utils';
import { createGameScreenMachine } from './game/game-screen.machine';
import { createLobbyScreenMachine } from './lobby/lobby-screen.machine';
import { createUnclaimedScreenMachine } from './unclaimed';

// const clubScreenModel = createModel(
//   {
//     hostPlayerName: '' as string,
//     authActor: {} as AuthActor,
//     actorManager: {} as ActorManager,
//     partyActor: undefined as PartyActor | undefined,
//     myActor: undefined as PartyPlayerActor | undefined,
//   },
//   {
//     events: {
//       PRESS_CLAIM: () => ({}),
//       PRESS_JOIN: () => ({}),
//       PRESS_PRIMARY: () => ({}),
//     },
//   }
// );

// export const ClubScreenEvents = clubScreenModel.events;

// interface CreateMachineProps {
//   hostPlayerName: string;
//   authActor: AuthActor;
// }

// const loadData = async () => {
//   return { hi: 'bye' };
// };

type ClubScreenContext = {
  hostPlayerName: string;
};

const loadData = async () => {
  return { isUnclaimed: false, isPlaying: false };
};

type LoadingResult = ReturnType<typeof loadData>;

const LOADING_DONE_EVENT =
  'done.invoke.ClubScreenMachine.Loading:invocation[0]' as string;

type ClubScreenEvents =
  | { type: 'PRESS_JOIN' }
  | {
      type: typeof LOADING_DONE_EVENT;
      data: LoadingResult;
    };

interface CreateMachineProps {
  hostPlayerName: string;
  authActor: AuthActor;
}

export const createClubScreenMachine = ({
  hostPlayerName,
  authActor,
}: CreateMachineProps) => {
  return createMachine({
    id: 'ClubScreenMachine',
    initial: 'Loading',
    schema: {
      context: {} as ClubScreenContext,
      events: {} as ClubScreenEvents,
    },
    states: {
      Loading: {
        invoke: {
          src: loadData,
          onDone: [
            {
              target: 'Unclaimed',
              cond: (_, event) => {
                assertEventType(event, LOADING_DONE_EVENT);
                return event.data.isUnclaimed;
              },
            },
            {
              target: 'Game',
              cond: (_, event) => {
                assertEventType(event, LOADING_DONE_EVENT);
                return event.data.isPlaying;
              },
            },
            { target: 'Lobby' },
          ],
        },
      },
      Unclaimed: {
        invoke: {
          id: 'unclaimedScreen',
          src: () => createUnclaimedScreenMachine(),
        },
      },
      Lobby: {
        invoke: {
          id: 'lobbyScreen',
          src: () => createLobbyScreenMachine(),
        },
      },
      Game: {
        invoke: {
          id: 'gameScreen',
          src: () => createGameScreenMachine(),
        },
      },
    },
  });
};

/**
 * Add ourselves to `user_party_connections` when we connect
 * and remove when we disconnect. This is how party server
 * knows which parties to spawn.
 */
export type ClubScreenMachine = ReturnType<typeof createClubScreenMachine>;
export type ClubScreenActor = ActorRefFrom<ClubScreenMachine>;
export type ClubScreenState = StateFrom<ClubScreenMachine>;
