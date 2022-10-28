import { ActorID, SharedMachineProps } from '@explorers-club/actor';
import { ActorRefFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const partyPlayerModel = createModel(
  {
    playerName: undefined as string | undefined,
  },
  {
    events: {
      PLAYER_UNREADY: () => ({}),
      PLAYER_READY: () => ({}),
      PLAYER_RECONNECT: () => ({}),
      PLAYER_DISCONNECT: () => ({}),
    },
  }
);

export const PartyPlayerEvents = partyPlayerModel.events;

// todo enumerate somehow to get create enum type
// type PlayerDisconnectedEvent = ReturnType<
//   typeof PartyPlayerEvents.PLAYER_RECONNECT
// >;

export const getPartyPlayerActorId = (userId: string) =>
  `PartyPlayer-${userId}` as ActorID;

export const createPartyPlayerMachine = ({ actorId }: SharedMachineProps) =>
  partyPlayerModel.createMachine(
    {
      id: actorId,
      type: 'parallel',
      states: {
        Ready: {
          initial: 'No',
          states: {
            No: {
              on: {
                PLAYER_READY: 'Yes',
              },
            },
            Yes: {
              on: {
                PLAYER_UNREADY: 'No',
              },
            },
          },
        },
        Connected: {
          initial: 'Yes',
          states: {
            No: {
              on: {
                PLAYER_RECONNECT: 'Yes',
              },
            },
            Yes: {
              on: {
                PLAYER_DISCONNECT: 'No',
              },
            },
          },
        },
      },
      predictableActionArguments: true,
    },
    {
      services: {},
    }
  );

export type PartyPlayerMachine = ReturnType<typeof createPartyPlayerMachine>;
export type PartyPlayerState = StateFrom<PartyPlayerMachine>;
export type PartyPlayerActor = ActorRefFrom<PartyPlayerMachine>;
