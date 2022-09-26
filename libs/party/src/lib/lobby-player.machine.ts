import { ActorID, SharedMachineProps } from '@explorers-club/actor';
import { ActorRefFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

interface LobbyPlayerProps {
  userId: string;
}

const lobbyPlayerModel = createModel(
  {},
  {
    events: {
      READY: () => ({}),
      UNREADY: () => ({}),
    },
  }
);

export const getLobbyPlayerActorId = (userId: string) =>
  `LobbyPlayer-${userId}` as ActorID;

export const createLobbyPlayerMachine = ({ actorId }: SharedMachineProps) =>
  lobbyPlayerModel.createMachine({
    id: actorId,
    initial: 'NotReady',
    states: {
      NotReady: {
        on: {
          READY: 'Ready',
        },
      },
      Ready: {
        on: {
          UNREADY: 'NotReady',
        },
      },
    },
  });

export type LobbyPlayerMachine = ReturnType<typeof createLobbyPlayerMachine>;
export type LobbyPlayerActor = ActorRefFrom<LobbyPlayerMachine>;