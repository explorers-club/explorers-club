import { MapSchema, Schema, SetSchema, type } from '@colyseus/schema';
import { ClubPlayer } from './ClubState';

export class DiffusionaryPlayer extends ClubPlayer {
  @type('number') score = 0;
}

export class DiffusionaryState extends Schema {
  @type('number') currentRound = 1;
  @type({ set: 'string' }) currentStates: SetSchema<string> = new SetSchema();

  @type({ map: DiffusionaryPlayer })
  public players: MapSchema<DiffusionaryPlayer> = new MapSchema<DiffusionaryPlayer>();
}
