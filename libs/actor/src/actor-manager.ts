import {
  AnyActorRef,
  AnyInterpreter,
  AnyState,
  AnyStateMachine,
  interpret,
  State,
} from 'xstate';
import { EventEmitter } from 'events';
import {
  ActorID,
  ActorType,
  SharedMachineProps,
  SharedActorRef,
  SerializedSharedActor,
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

export interface ManagedActor {
  actorId: ActorID;
  actorType: ActorType;
  actor: AnyActorRef;
}

export declare interface ActorManager {
  on(event: 'SPAWN', listener: (props: ManagedActor) => void): this;
  on(event: 'HYDRATE', listener: (props: ManagedActor) => void): this;
  on(event: 'HYDRATE_ALL', listener: () => void): this;
}

/**
 * Class to manage actors that are shared across a channel at runtime.
 */
export class ActorManager extends EventEmitter {
  actorMap = new Map<string, { actor: AnyInterpreter; actorType: ActorType }>();
  private _rootActorId: ActorID;
  private _myActorId?: ActorID;

  constructor(rootActorId: ActorID) {
    super();
    this._rootActorId = rootActorId;
  }

  /**
   * Used to create a new actor. Each actorId should only ever be spawned
   * once. After it's spawned, it sent across the network to host and/or clients
   * to be "hydrated".
   */
  spawn({ actorId, actorType }: SharedActorRef) {
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
    const actor = interpret(machine).start();

    this.actorMap.set(actor.id, { actor, actorType });
    this.emit('SPAWN', { actorId, actorType, actor });

    return actor;
  }

  /**
   * After an actor is spawned on the network, it should be hydrated
   * by clients when they receive the spawn event.
   */
  hydrate({ actorId, actorType, stateJSON }: SerializedSharedActor) {
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

    const state = JSON.parse(stateJSON) as AnyState;
    const previousState = State.create(state);

    const actor = interpret(machine).start(previousState);
    this.actorMap.set(actorId, { actor, actorType });
    this.emit('HYDRATE', { actorId, actorType, actor });

    return actor;
  }

  hydrateAll(payload: SerializedSharedActor[]) {
    payload.forEach((actorProps) => {
      this.hydrate(actorProps);
    });

    this.emit('HYDRATE_ALL');
  }

  /**
   * Returns serialized state for a single actor. State is in the form of a JSON string.
   * @param actorID
   * @returns
   */
  serialize(actorID: ActorID) {
    const actorData = this.actorMap.get(actorID);
    if (!actorData) {
      throw new Error("trying to serialize actor that wasn't found" + actorID);
    }

    const { actor, actorType } = actorData;
    const stateJSON = JSON.stringify(actor.getSnapshot());
    return {
      actorId: actor.id,
      actorType,
      stateJSON,
    };
  }

  /**
   * Returns a serialized state of all actors
   * @returns Objecting containting the id, type, and state of an actor.
   */
  serializeAll() {
    return Array.from(this.actorMap.values()).map(({ actor }) => {
      return this.serialize(actor.id);
    });
  }

  getActor(actorId: ActorID) {
    return this.actorMap.get(actorId)?.actor;
  }

  getActorsForType(_actorType: ActorType) {
    return Array.from(this.actorMap.values())
      .filter(({ actorType }) => _actorType === actorType)
      .map(({ actor }) => actor);
  }

  set myActorId(value: ActorID) {
    this._myActorId = value;
  }

  get myActor() {
    return this.getActor(this.myActorId);
  }

  get rootActor() {
    return this.getActor(this._rootActorId);
  }

  get allActors() {
    return Array.from(this.actorMap.values()).map(({ actor }) => actor);
  }
}
