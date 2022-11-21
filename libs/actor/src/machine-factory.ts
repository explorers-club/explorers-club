import { AnyStateMachine } from "xstate";
import { SharedMachineProps, ActorType } from "./types";

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