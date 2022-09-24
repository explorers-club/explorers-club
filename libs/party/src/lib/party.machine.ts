import { ActorID, SharedMachineProps } from '@explorers-club/actor';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { getPartyPlayerActorId } from './party-player.machine';

export const PLAYER_CONNECTED = (props: { userId: string }) => props;
export const PLAYER_DISCONNECTED = (props: { userId: string }) => props;

export type PlayerConnectedEvent = ReturnType<typeof PLAYER_CONNECTED>;
export type PlayerDisconnectedEvent = ReturnType<typeof PLAYER_DISCONNECTED>;

const gameMachine = createMachine({
  id: 'GameMachine',
  initial: 'Loading',
  states: {
    Loading: {},
  },
});

const partyModel = createModel(
  {
    playerActorIds: [] as string[],
  },
  {
    events: {
      PLAYER_DISCONNECTED,
      PLAYER_CONNECTED,
    },
  }
);

export const PartyEvents = partyModel.events;

export const getPartyActorId = (joinCode: string) =>
  `Party-${joinCode}` as ActorID;

export const createPartyMachine = ({
  actorId,
  actorManager,
}: SharedMachineProps) =>
  partyModel.createMachine(
    {
      id: actorId,
      context: partyModel.initialContext,
      initial: 'Lobby',
      on: {
        PLAYER_CONNECTED: {
          actions: partyModel.assign({
            playerActorIds: (context, { userId }) => {
              const actorId: ActorID = getPartyPlayerActorId(userId);
              return [...context.playerActorIds, actorId];
            },
          }),
        },
        PLAYER_DISCONNECTED: {
          actions: partyModel.assign({
            playerActorIds: (context, { userId }) => {
              getPartyActorId(userId);
              const actorId = '';
              return context.playerActorIds.filter((id) => id !== actorId);
            },
          }),
        },
      },
      states: {
        Lobby: {
          onDone: 'Game',
          initial: 'Waiting',
          states: {
            Waiting: {},
            AllReady: {},
            EnteringGame: {
              type: 'final' as const,
            },
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
      predictableActionArguments: true,
    },
    {}
  );

export type GameActor = ActorRefFrom<typeof gameMachine>;
export type GameState = StateFrom<typeof gameMachine>;

export type PartyMachine = ReturnType<typeof createPartyMachine>;
export type PartyActor = ActorRefFrom<PartyMachine>;
export type PartyState = StateFrom<PartyMachine>;
