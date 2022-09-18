import { RealtimeChannel } from '@supabase/supabase-js';
import { AnyActorRef, AnyStateMachine, interpret, State } from 'xstate';
import { ActorEvents } from './events';
import { EventEmitter } from 'events';
import {
  ActorID,
  ActorType,
  SharedActorProps,
  SharedMachineProps,
  SpawnProps,
} from './types';

type CreateMachineFunction = (props: SharedMachineProps) => AnyStateMachine;

/**
 * Class to be imported on client and server, and each will register the different
 * type of machines it needs
 */
export class MachineFactory {
  private static map: Map<ActorType, CreateMachineFunction> = new Map();

  static registerMachine(
    type: ActorType,
    createMachine: CreateMachineFunction
  ) {
    this.map.set(type, createMachine);
  }

  static getCreateMachineFunction(type: ActorType) {
    return this.map.get(type);
  }
}

interface ManagedActor {
  actorId: ActorID;
  actorType: ActorType;
  actor: AnyActorRef;
}

export declare interface ActorManager {
  on(event: 'hydrate', listener: (props: ManagedActor) => void): this;
  on(event: 'hydrateAll', listener: () => void): this;
}

export class ActorManager extends EventEmitter {
  private actorMap = new Map<
    string,
    { actor: AnyActorRef; actorType: ActorType }
  >();
  private channel: RealtimeChannel;
  private rootActorId: ActorID;

  constructor(channel: RealtimeChannel, rootActorId: ActorID) {
    super();
    this.channel = channel;
    this.rootActorId = rootActorId;
  }

  async syncAll() {
    const payload = Array.from(this.actorMap.values()).map(
      ({ actor, actorType }) => ({
        actorId: actor.id,
        actorType,
        state: actor.getSnapshot(),
      })
    );

    const event = ActorEvents.SYNC_ALL(payload);

    return await this.channel.send(event);
  }

  spawn({ actorId, actorType }: SpawnProps) {
    const createMachine = MachineFactory.getCreateMachineFunction(actorType);
    if (!createMachine) {
      throw new Error(
        `tried to get create machine function for unregistered type ${actorType}`
      );
    }

    const machine = createMachine({
      actorId,
      actorManager: this,
    });
    const actor = interpret(machine);
    actor.start();

    this.channel
      .send(
        ActorEvents.SPAWN({
          actorId,
          actorType,
          state: actor.getSnapshot(),
        } as SharedActorProps)
      )
      .then(() => {
        // TODO: emit event here? actorManager could be observable that is invoked
      });

    this.actorMap.set(actor.id, { actor, actorType });
    return actor;
  }

  hydrateAll(payload: SharedActorProps[]) {
    payload.forEach((actorProps) => {
      this.hydrate(actorProps);
    });

    this.emit('hydrateAll');
  }

  hydrate({ actorId, actorType, state }: SharedActorProps) {
    // Don't re-hydrate actors we already have
    if (this.actorMap.has(actorId)) {
      return;
    }

    const createMachine = MachineFactory.getCreateMachineFunction(actorType);
    if (!createMachine) {
      throw new Error(
        `missing create machine function for actor type ${actorType}. make sure it is registered with the MachineFactory`
      );
    }

    const machine = createMachine({
      actorId,
      actorManager: this,
    });

    const previousState = State.create(state);

    const actor = interpret(machine).start(previousState);
    this.actorMap.set(actorId, { actor, actorType });
    this.emit('hydrate', { actorId, actorType, actor });

    return actor;
  }

  getActor(actorId: ActorID) {
    return this.actorMap.get(actorId)?.actor;
  }

  get rootActor() {
    return this.getActor(this.rootActorId);
  }

  get allActors() {
    return Array.from(this.actorMap.values()).map(({ actor }) => actor);
  }
}
