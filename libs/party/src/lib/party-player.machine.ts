import { SharedMachineProps } from '@explorers-club/actor';
import { ActorRefFrom, assign, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const partyPlayerModel = createModel(
  {
    playerName: undefined as string | undefined,
    userId: '' as string,
  },
  {
    events: {
      SET_PLAYER_NAME: ({ playerName }: { playerName: string }) => ({
        playerName,
      }),
      PLAYER_UNREADY: () => ({}),
      PLAYER_READY: () => ({}),
      PLAYER_REJOIN: () => ({}),
      PLAYER_DISCONNECT: () => ({}),
    },
  }
);

export const PartyPlayerEvents = partyPlayerModel.events;

// todo enumerate somehow to get create enum type
// type PlayerDisconnectedEvent = ReturnType<
//   typeof PartyPlayerEvents.PLAYER_REJOIN
// >;

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
                PLAYER_DISCONNECT: 'No',
              },
            },
          },
        },
        Connected: {
          initial: 'Yes',
          on: {
            SET_PLAYER_NAME: {
              actions: 'assignPlayerName',
            },
          },
          states: {
            No: {
              on: {
                PLAYER_REJOIN: 'Yes',
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
      actions: {
        assignPlayerName: assign({
          playerName: (context, event) => {
            if (event.type === 'SET_PLAYER_NAME') {
              return event.playerName;
            } else {
              return context.playerName;
            }
          },
        }),
      },
    }
  );

export type PartyPlayerMachine = ReturnType<typeof createPartyPlayerMachine>;
export type PartyPlayerState = StateFrom<PartyPlayerMachine>;
export type PartyPlayerActor = ActorRefFrom<PartyPlayerMachine>;
