import {
  ActorRefFrom,
  ContextFrom,
  createMachine,
  EventFrom,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';

// TODO break this up to separate sub screens...
export const lobbyModel = createModel(
  {
    username: undefined as string | undefined,
  },
  {
    events: {
      SUBMIT_NAME: (name: string) => ({ name }),
      JOIN_PARTY: (code: string) => ({ code }),
      START_PARTY: () => ({}),
    },
  }
);

export const lobbyMachine = createMachine(
  {
    id: 'lobbyMachine',
    initial: 'Start',
    context: lobbyModel.initialContext,
    states: {
      Start: {
        on: {
          JOIN_PARTY: [
            {
              target: 'EnterName',
              cond: 'isMissingUsername',
            },
            { target: 'Main' },
          ],
          START_PARTY: [
            {
              target: 'EnterName',
              cond: 'isMissingUsername',
            },
            {
              target: 'Main',
            },
          ],
        },
      },
      EnterName: {},
      Main: {},
      Loading: {},
    },
  },
  {
    guards: {
      isMissingUsername: (context: LobbyContext) => !context.username,
    },
  }
);

export type LobbyContext = ContextFrom<typeof lobbyModel>;
export type LobbyEvent = EventFrom<typeof lobbyModel>;
export type LobbyActor = ActorRefFrom<typeof lobbyMachine>;
export type LobbyState = StateFrom<typeof lobbyMachine>;

export default lobbyMachine;
