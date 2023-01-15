// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.44
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { ClubPlayer } from './ClubPlayer'

export class CodebreakersPlayer extends ClubPlayer {
    @type("string") public team!: string;
    @type({ set: "string" }) public highlightedWords: SetSchema<string> = new SetSchema<string>();
}
