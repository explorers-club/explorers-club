import { MapSchema, Schema, SetSchema, type } from '@colyseus/schema';
import { ClubPlayer } from './ClubState';

export class LittleVigilantePlayer extends ClubPlayer {
  @type('number') score = 0;
}

export class LittleVigilanteState extends Schema {
  @type('number') currentRound = 1;
  @type({ set: 'string' }) currentStates: SetSchema<string> = new SetSchema();
  @type({ map: LittleVigilantePlayer })
  public players: MapSchema<LittleVigilantePlayer> = new MapSchema<LittleVigilantePlayer>();
}
