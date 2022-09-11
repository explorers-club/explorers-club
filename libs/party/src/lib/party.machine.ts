import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
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

const createLobbyPlayerMachine = ({ userId }: LobbyPlayerProps) =>
  lobbyPlayerModel.createMachine({
    id: 'LobbyPlayerMachine',
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

type LobbyPlayerMachine = ReturnType<typeof createLobbyPlayerMachine>;
type LobbyPlayerActor = ActorRefFrom<LobbyPlayerMachine>;
// type LobbyPlayerActor = ActorRefFrom<LobbyPlayerMachine>;

const lobbyModel = createModel(
  {
    lobbyPlayers: [] as LobbyPlayerActor[],
  },
  {
    events: {},
  }
);

// const LobbyEvents = lobbyModel.events;

const lobbyMachine = createMachine(
  {
    id: 'LobbyMachine',
    initial: 'Waiting',
    context: lobbyModel.initialContext,
    states: {
      Waiting: {},
      AllReady: {},
      EnteringGame: {
        type: 'final' as const,
      },
    },
  },
  {
    guards: {
      allPlayersReady: (context) =>
        context.lobbyPlayers.filter(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (player) => !player.getSnapshot()!.matches('Ready')
        ).length === 0,
    },
  }
);

const gameMachine = createMachine({
  id: 'GameMachine',
  initial: 'Loading',
  states: {
    Loading: {},
  },
});

interface PartyPlayer {
  userId: string;
  isConnected: boolean;
}

const partyModel = createModel(
  {
    players: [] as PartyPlayer[],
  },
  {
    events: {
      PLAYER_CONNECTED: (props: { userId: string }) => props,
      PLAYER_DISCONNECTED: (props: { userId: string }) => props,
    },
  }
);

export const PartyEvents = partyModel.events;

export const partyMachine = createMachine({
  id: 'PartyMachine',
  context: partyModel.initialContext,
  initial: 'Lobby',
  states: {
    Lobby: {
      invoke: {
        id: 'lobbyActor',
        src: lobbyMachine,
        onDone: 'Game',
      },
    },
    Game: {
      invoke: {
        id: 'gameActor',
        src: gameMachine,
        onDone: 'Lobby',
      },
    },
  },
});

type PartyState = StateFrom<typeof partyMachine>;

export const CURRENT_STATE_EVENT = (props: { state: PartyState }) => ({
  type: 'broadcast',
  event: 'currentState',
  payload: props.state,
});
export type CurrentStateEvent = ReturnType<typeof CURRENT_STATE_EVENT>;
