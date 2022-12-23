import { Schema } from '@colyseus/schema';
import { Room } from 'colyseus.js';
import { SerializedSchema } from '../types';

// tood hosit to lib
export const createRoomStore = <
  TSchema extends Schema,
  TCommand extends { type: string }
>(
  room: Room<TSchema>
) => {
  let state: SerializedSchema<TSchema> =
    room.state.toJSON() as SerializedSchema<TSchema>;

  const subscribe = (onStoreChange: () => void) => {
    const emitter = room.onStateChange(() => {
      state = room.state.toJSON() as SerializedSchema<TSchema>;
      onStoreChange();
    });
    return () => emitter.remove(onStoreChange);
  };

  const getSnapshot = () => {
    return state;
  };

  const send = (command: TCommand) => room.send(command.type, command);

  return {
    subscribe,
    getSnapshot,
    send,
  };
};
