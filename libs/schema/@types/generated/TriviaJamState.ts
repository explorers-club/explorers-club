// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.44
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { ClubPlayer } from './ClubPlayer'
import { TriviaJamConfig } from './TriviaJamConfig'
import { TriviaJamPlayer } from './TriviaJamPlayer'

export class TriviaJamState extends Schema {
    @type(ClubPlayer) public hostPlayer: ClubPlayer = new ClubPlayer();
    @type(TriviaJamConfig) public config: TriviaJamConfig = new TriviaJamConfig();
    @type("string") public currentQuestionEntryId!: string;
    @type({ set: "string" }) public currentStates: SetSchema<string> = new SetSchema<string>();
    @type({ map: "string" }) public currentResponsesSerialized: MapSchema<string> = new MapSchema<string>();
    @type({ map: "number" }) public currentQuestionPoints: MapSchema<number> = new MapSchema<number>();
    @type({ map: TriviaJamPlayer }) public players: MapSchema<TriviaJamPlayer> = new MapSchema<TriviaJamPlayer>();
}
