import { AnyEventObject, AnyState, AnyStateMachine } from 'xstate';
import { ActorEventType, ActorType } from './types';
import { partyMachine } from '@explorers-club/party';

export * from './types';

const INITIALIZE = (payload: {
  actorId: string;
  actorType: ActorType;
  state: AnyState;
}) => ({
  type: 'broadcast',
  event: ActorEventType.INITIALIZE,
  payload,
});

const SEND = (payload: {
  actorId: string;
  actorType: ActorType;
  event: AnyEventObject;
}) => ({
  type: 'broadcast',
  event: ActorEventType.SEND,
  payload,
});

export type ActorInitializeEvent = ReturnType<typeof INITIALIZE>;
export type ActorSendEvent = ReturnType<typeof SEND>;

export const ActorEvents = {
  INITIALIZE,
  SEND,
};

export const ActorMachineMap: Record<ActorType, AnyStateMachine> = {
  PARTY_ACTOR: partyMachine,
};
