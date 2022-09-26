import { ActorID, SharedMachineProps } from '@explorers-club/actor';
import { ActorRefFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const partyPlayerModel = createModel(
  {},
  {
    events: {
      READY: () => ({}),
    },
  }
);

export const getPartyPlayerActorId = (userId: string) =>
  `PartyPlayer-${userId}` as ActorID;

export const createPartyPlayerMachine = ({ actorId }: SharedMachineProps) =>
  partyPlayerModel.createMachine(
    {
      id: actorId,
      initial: 'Spawned',
      states: {
        Spawned: {},
        Connected: {},
        Disconnected: {},
      },
    },
    {
      services: {},
    }
  );

export type PartyPlayerMachine = ReturnType<typeof createPartyPlayerMachine>;
export type PartyPlayerState = StateFrom<PartyPlayerMachine>;
export type PartyPlayerActor = ActorRefFrom<PartyPlayerMachine>;
