import { MapSchema, Schema, type } from '@colyseus/schema';

export class TriviaJamPlayer extends Schema {
  @type('string') name!: string;
  @type('boolean') connected = true;
  @type('number') score = 0;
}

export class TriviaJamState extends Schema {
  @type('string')
  hostSessionId!: string;

  @type({ map: TriviaJamPlayer }) public players: MapSchema<TriviaJamPlayer> =
    new MapSchema<TriviaJamPlayer>();
}
