import { prependOnceListener } from 'process';
import { AnyState, AnyEventObject } from 'xstate';
import { SharedActorProps, ActorEventType, ActorID } from './types';

const SPAWN = ({ state, ...props }: SharedActorProps) => {
  const stateJSON = JSON.parse(JSON.stringify(state)) as AnyState;
  return {
    type: 'broadcast',
    event: ActorEventType.SPAWN,
    payload: {
      ...props,
      state: stateJSON,
    } as SharedActorProps,
  };
};

const SEND = (payload: { actorId: ActorID; event: AnyEventObject }) => ({
  type: 'broadcast',
  event: ActorEventType.SEND,
  payload,
});

const SYNC_ALL = (payload: SharedActorProps[]) => {
  return {
    type: 'broadcast',
    event: ActorEventType.SYNC_ALL,
    payload: payload.map(({ state, ...props }) => {
      const stateJSON = JSON.parse(JSON.stringify(state)) as AnyState;
      return {
        ...props,
        state: stateJSON,
      };
    }),
  };
};

export type SendActorEvent = ReturnType<typeof SEND>;
export type SpawnActorEvent = ReturnType<typeof SPAWN>;
export type SyncActorsEvent = ReturnType<typeof SYNC_ALL>;

export const ActorEvents = {
  SEND,
  SPAWN,
  SYNC_ALL,
};
