import { Schema } from '@colyseus/schema';
import { Room } from 'colyseus.js';
import { SerializedSchema } from '../types';

export const createRoomStore = <
  TSchema extends Schema,
  TCommand extends { type: string }
>(
  room: Room<TSchema>
) => {
  let state: SerializedSchema<TSchema> =
    room.state.toJSON() as SerializedSchema<TSchema>;

  const handleOnStateChange = () => {
    state = room.state.toJSON() as SerializedSchema<TSchema>;
  };
  room.onStateChange(handleOnStateChange);

  const subscribe = (
    onStoreChange: (state: SerializedSchema<TSchema>) => void
  ) => {
    const handleOnStateChange = () => {
      onStoreChange(state);
    };
    const emitter = room.onStateChange(handleOnStateChange);

    onStoreChange(state);
    return () => emitter.remove(handleOnStateChange);
  };

  const getSnapshot = () => {
    return state;
  };

  const send = (command: TCommand) => room.send(command.type, command);

  return {
    id: room.id,
    subscribe,
    getSnapshot,
    send,
  };
};
