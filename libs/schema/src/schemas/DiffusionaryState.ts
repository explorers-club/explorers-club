import { Schema, MapSchema, type } from '@colyseus/schema';

export class DiffusionaryPlayer extends Schema {
  @type('string') name!: string;
  @type('boolean') connected = true;
  @type('number') score = 0;
}

export class DiffusionaryState extends Schema {
  @type('number') currentRound = 1;

  @type({ map: DiffusionaryPlayer })
  public players: MapSchema<DiffusionaryPlayer> = new MapSchema<DiffusionaryPlayer>();
}
