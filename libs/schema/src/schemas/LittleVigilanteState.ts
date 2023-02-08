import {
  ArraySchema,
  MapSchema,
  Schema,
  SetSchema,
  type,
} from '@colyseus/schema';
import { ClubPlayer } from './ClubState';

export class LittleVigilantePlayer extends ClubPlayer {
  @type('number') score = 0;

  @type({ map: 'string' })
  public currentRoundRoleTargets: MapSchema<string> = new MapSchema<string>();
}

export class LittleVigilanteState extends Schema {
  @type('string') conversationId!: string;
  @type('number') currentRound = 1;

  @type({ set: 'string' }) currentStates: SetSchema<string> = new SetSchema();
  @type({ set: 'string' }) hostUserIds: SetSchema<string> = new SetSchema();
  @type({ array: 'string' }) roles: ArraySchema<string> = new ArraySchema();

  @type({ array: 'string' }) chatMessagesSerialized: ArraySchema<string> =
    new ArraySchema();

  @type('number') timeRemaining!: number;

  @type({ map: 'string' })
  public currentRoundRoles: MapSchema<string> = new MapSchema<string>();

  @type({ map: 'string' })
  public initialCurrentRoundRoles: MapSchema<string> = new MapSchema<string>();

  @type({ map: 'string' })
  public currentRoundVotes: MapSchema<string> = new MapSchema<string>();

  @type({ map: 'number' })
  public currentRoundPoints: MapSchema<number> = new MapSchema<number>();

  @type({ map: 'boolean' })
  public calledVoteResponses: MapSchema<boolean> = new MapSchema<boolean>();

  @type('string')
  public currentRoundArrestedPlayerId = '';

  @type({ map: LittleVigilantePlayer })
  public players: MapSchema<LittleVigilantePlayer> = new MapSchema<LittleVigilantePlayer>();
}
