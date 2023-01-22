import { MapSchema, SetSchema, Schema, type } from '@colyseus/schema';
import { ClubPlayer } from './ClubState';

export class TriviaJamPlayer extends ClubPlayer {
  @type('number') score = 0;
}

export class TriviaJamState extends Schema {
  @type(ClubPlayer) hostPlayer!: ClubPlayer;
  @type('string') currentQuestionEntryId: string | undefined;
  @type({ set: 'string' }) currentStates: SetSchema<string> = new SetSchema();
  @type({ map: 'string' }) currentResponsesSerialized: MapSchema<string> =
    new MapSchema();
  @type({ map: 'number' }) currentQuestionPoints: MapSchema<number> =
    new MapSchema();
  @type({ map: TriviaJamPlayer }) players: MapSchema<TriviaJamPlayer> =
    new MapSchema();
}
