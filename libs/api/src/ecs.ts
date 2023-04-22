import {
  Entity,
  EntityMachineMap,
  InitialEntityProps,
  SnowflakeId,
} from '@explorers-club/schema';
import { InterpreterFrom, interpret } from 'xstate';
import { EPOCH, TICK_RATE } from './ecs.constants';
import { machineMap } from './machines';
import { world } from './world';
import { produce, enablePatches, produceWithPatches } from 'immer';
enablePatches();

export function getCurrentTick(): number {
  const now = new Date();
  const timeSinceEpoch = now.getTime() - EPOCH;
  const tick = Math.floor(timeSinceEpoch / (1000 / TICK_RATE));
  const tickDecimal = (timeSinceEpoch / (1000 / TICK_RATE)) % 1;
  return parseFloat(`${tick}.${tickDecimal.toFixed(1).slice(2)}`);
}

const WORKER_ID_BITS = 10;
const SEQUENCE_BITS = 12;

const workerId = Math.floor(Math.random() * 2 ** WORKER_ID_BITS);
let sequence = 0;
let lastTimestamp = -1;

export function generateSnowflakeId(): string {
  let timestamp = Date.now() - EPOCH;
  if (timestamp === lastTimestamp) {
    sequence = (sequence + 1) % 2 ** SEQUENCE_BITS;
    if (sequence === 0) {
      // Sequence overflow, wait for next millisecond
      timestamp++;
      while (Date.now() - EPOCH <= timestamp) {
        // Wait
      }
    }
  } else {
    sequence = 0;
  }
  lastTimestamp = timestamp;
  const id =
    (timestamp << (WORKER_ID_BITS + SEQUENCE_BITS)) |
    (workerId << SEQUENCE_BITS) |
    sequence;
  return id.toString();
}

export const entitiesById = new Map<SnowflakeId, Entity>();

const READONLY_ENTITY_PROPS = new Set<string | symbol>([
  'id',
  'subscribe',
  'send',
]);

// TODO update this to infer TEntity from
/**
 * Isomorphic function for creating an entity.
 * We need to dynamically register the machines on the client.
 * @param entityProps
 * @returns
 */
export const createEntity = <TEntity extends Entity>(
  entityProps: InitialEntityProps<TEntity>
) => {
  type PropNames = keyof TEntity;
  type TCallback = Parameters<TEntity['subscribe']>[0];
  type TEvent = Parameters<TCallback>[0];
  type TMachine = EntityMachineMap[typeof entityProps.schema]['machine'];
  type TInterpreter = InterpreterFrom<TMachine>;
  type TStateValue = TEntity['states'];
  type TCommand = Parameters<TEntity['send']>[0];

  const subscriptions = new Set<TCallback>();

  const subscribe = (callback: TCallback) => {
    subscriptions.add(callback);
    return () => {
      subscriptions.delete(callback);
    };
  };

  const next = (event: TEvent) => {
    for (const callback of subscriptions) {
      callback(event as any); // todo fix TS not liking nested union types on event
    }
  };

  const handler: ProxyHandler<TEntity> = {
    set: (target, property, value) => {
      if (READONLY_ENTITY_PROPS.has(property)) {
        return true;
      }

      const [nextState, patches] = produceWithPatches(target, (draft) => {
        type Prop = keyof typeof draft;
        draft[property as Prop] = value;
      });

      return true; // Indicate that the assignment was successful
    },
  };

  /**
   * The send method collects events to be processed on central queues
   * @param command 
   */
  const send = (command: TCommand) => {

    next({
      type: 'SEND_TRIGGER',
      command,
    } as any);

    entity.command = command;
    service.send(command);

    next({
      type: 'SEND_COMPLETE',
      command,
    } as any);
  };

  //   const matches = (params: TMatchParams) =>
  //     service.getSnapshot().matches(params);

  const entityBase = {
    id: generateSnowflakeId(),
    send,
    subscribe,
    // children: [],
  };

  const entity: TEntity = {
    ...entityBase,
    ...entityProps,
  } as unknown as TEntity; // todo fix hack, pretty sure this works though

  const proxy = new Proxy(entity, handler);
  const machine = machineMap[entityProps.schema]({
    world,
    entity: proxy,
  });
  // todo fix types
  const service = interpret(machine as any) as unknown as TInterpreter;
  service.start();
  service.onTransition((state) => {
    proxy.states = state.value as TStateValue;
    next({
      type: 'TRANSITION',
    });
  });

  entitiesById.set(entity.id, proxy);
  return proxy;
};
