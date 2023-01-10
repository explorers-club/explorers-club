import { MapSchema, Schema, SetSchema, type } from '@colyseus/schema';
import { ClubPlayer } from './ClubState';

export class LittleVigilantePlayer extends ClubPlayer {
  @type('number') score = 0;
}

export class LittleVigilanteState extends Schema {
  @type('number') currentRound = 1;

  @type({ set: 'string' }) currentStates: SetSchema<string> = new SetSchema();
  @type({ set: 'string' }) hostUserIds: SetSchema<string> = new SetSchema();

  @type({ map: 'string' })
  public currentRoundRoles: MapSchema<string> = new MapSchema<string>();

  @type({ map: 'number' })
  public currentRoundPoints: MapSchema<number> = new MapSchema<number>();

  @type({ map: LittleVigilantePlayer })
  public players: MapSchema<LittleVigilantePlayer> = new MapSchema<LittleVigilantePlayer>();
}
