import { RealtimeChannel } from '@supabase/supabase-js';
import { AnyActorRef, AnyStateMachine, interpret, State } from 'xstate';
import { ActorEvents } from './events';
import {
  ActorID,
  ActorType,
  SharedActorProps,
  SharedMachineProps,
  SpawnProps,
} from './types';

type CreateMachineFunction = (props: SharedMachineProps) => AnyStateMachine;

// function createMachine<TCreateProps extends CreateMachineProps>({
//   createFunction,
//   props,
// }: {
//   createFunction: CreateMachineFunction;
//   props: TCreateProps;
// }): AnyStateMachine {
//   return createFunction(props);
// }

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

export class ActorManager {
  private actorMap = new Map<
    string,
    { actor: AnyActorRef; actorType: ActorType }
  >();
  private channel: RealtimeChannel;
  private rootActorId: ActorID;

  constructor(channel: RealtimeChannel, rootActorId: ActorID) {
    this.channel = channel;
    this.rootActorId = rootActorId;
  }

  syncAll() {
    this.channel.send(ActorEvents.SYNC_ALL(Object.values(this.actorMap)));
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
          actorId: actor.id,
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

    return actor;
  }

  get rootActor() {
    return this.actorMap.get(this.rootActorId)?.actor;
  }

  get allActors() {
    return Object.values(this.actorMap);
  }
}
