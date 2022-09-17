import { SharedMachineProps } from '@explorers-club/actor';
import { ActorRefFrom, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const partyPlayerModel = createModel(
  {
    userId: '' as string,
  },
  {
    events: {
      READY: () => ({}),
    },
  }
);

export const createPartyPlayerMachine = ({
  actorId,
  actorManager,
}: SharedMachineProps) =>
  partyPlayerModel.createMachine(
    {
      id: actorId,
      initial: 'Connecting',
      states: {
        Connecting: {},
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
