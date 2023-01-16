import {
  ArraySchema,
  MapSchema,
  Schema,
  SetSchema,
  type,
} from '@colyseus/schema';
import { ClubPlayer } from './ClubState';

export class CodebreakersPlayer extends ClubPlayer {
  @type('string') team!: string;
  @type('boolean') clueGiver!: boolean;
  @type({ set: 'string' }) highlightedWords: SetSchema<string> =
    new SetSchema();
}

export class CodebreakerBoardItem extends Schema {
  @type('string') word!: string;
  @type('string') belongsTo!: string;
  @type('string') guessedBy!: string;
}

export class CodebreakersState extends Schema {
  @type({ set: 'string' }) currentStates: SetSchema<string> = new SetSchema();

  @type('number') guessesRemaining = 0;
  @type('string') currentClue = '';
  @type('string') tripWord!: string;
  @type('string') currentTeam = 'A';

  @type({ set: 'string' }) hostUserIds: SetSchema<string> = new SetSchema();

  @type({ map: CodebreakersPlayer })
  public players: MapSchema<CodebreakersPlayer> = new MapSchema<CodebreakersPlayer>();

  @type({ array: CodebreakerBoardItem })
  public board: ArraySchema<CodebreakerBoardItem> = new ArraySchema();
}
