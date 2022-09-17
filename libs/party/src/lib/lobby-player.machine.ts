import { createModel } from "xstate/lib/model";

interface LobbyPlayerProps {
  userId: string;
}

const lobbyPlayerModel = createModel(
  { userId: '' as string },
  {
    events: {
      READY: () => ({}),
      UNREADY: () => ({}),
    },
  }
);

export const createLobbyPlayerMachine = ({ userId }: LobbyPlayerProps) =>
  lobbyPlayerModel.createMachine({
    id: `LobbyPlayer-${userId}`,
    initial: 'NotReady',
    context: {
      userId,
    },
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
