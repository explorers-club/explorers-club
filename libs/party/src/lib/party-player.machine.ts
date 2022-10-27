import { ActorID, SharedMachineProps } from '@explorers-club/actor';
import { ActorRefFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const partyPlayerModel = createModel(
  {
    playerName: undefined as string | undefined,
  },
  {
    events: {
      NOT_READY: () => ({}),
      READY: () => ({}),
      RECONNECT: () => ({}),
      DISCONNECT: () => ({}),
    },
  }
);

export const PartyPlayerEvents = partyPlayerModel.events;

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
                READY: 'Yes',
              },
            },
            Yes: {
              on: {
                NOT_READY: 'No',
              },
            },
          },
        },
        Connection: {
          initial: 'Connected',
          states: {
            Connected: {
              on: {
                DISCONNECT: 'Disconnected',
              },
            },
            Disconnected: {
              on: {
                RECONNECT: 'Connected',
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
