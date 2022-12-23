import {
  Schema,
  SetSchema,
  ArraySchema,
  MapSchema,
  CollectionSchema,
} from '@colyseus/schema';

// From a prop in colyseus schema, return the serialized
// version of it so that we can call toJSON() and type it.
// This allows us to ensure immutability when using
// usSyncExternalStore() — everytime there is a game state
// update we just toJSON() on it and let the selector
// logic handle memoization and updates.
type SerializaledProp<T> = T extends SetSchema<infer K>
  ? K extends Schema
    ? SerializedSchema<K>[]
    : K[]
  : T extends ArraySchema<infer K>
  ? K extends Schema
    ? SerializedSchema<K>[]
    : K[]
  : T extends CollectionSchema<infer K>
  ? K extends Schema
    ? SerializedSchema<K>[]
    : K[]
  : T extends MapSchema<infer K>
  ? K extends Schema
    ? Record<string, SerializedSchema<K>>
    : Record<string, K>
  : T;

export type SerializedSchema<TSchema> = {
  [K in NonFunctionPropNames<TSchema>]: SerializaledProp<TSchema[K]>;
};

type NonFunctionPropNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type RoomStore<T extends Schema, TCommand> = {
  subscribe: (cb: () => void) => () => void;
  getSnapshot: () => SerializedSchema<T>;
  send: (command: TCommand) => void;
};
