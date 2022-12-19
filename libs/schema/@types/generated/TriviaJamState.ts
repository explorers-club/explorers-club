// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.44
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { TriviaJamPlayer } from './TriviaJamPlayer'

export class TriviaJamState extends Schema {
    @type("string") public hostUserId!: string;
    @type("string") public currentQuestionEntryId!: string;
    @type({ set: "string" }) public currentStates: SetSchema<string> = new SetSchema<string>();
    @type({ map: TriviaJamPlayer }) public players: MapSchema<TriviaJamPlayer> = new MapSchema<TriviaJamPlayer>();
}
