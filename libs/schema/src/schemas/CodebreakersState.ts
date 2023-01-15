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
  @type({ set: 'string' }) highlightedWords: SetSchema<string> = new SetSchema();
}

export class CodebreakersState extends Schema {
  @type({ set: 'string' }) currentStates: SetSchema<string> = new SetSchema();

  @type('string') currentClue = '';
  @type('string') tripWord = '';

  @type({ set: 'string' }) board: ArraySchema<string> = new ArraySchema();
  @type({ set: 'string' }) hostUserIds: SetSchema<string> = new SetSchema();

  @type({ set: 'string' }) teamAWords: SetSchema<string> = new SetSchema();
  @type({ set: 'string' }) teamBWords: SetSchema<string> = new SetSchema();

  @type({ map: CodebreakersPlayer })
  public players: MapSchema<CodebreakersPlayer> = new MapSchema<CodebreakersPlayer>();
}
