// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.44
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { CodebreakersPlayer } from './CodebreakersPlayer'
import { CodebreakerBoardItem } from './CodebreakerBoardItem'

export class CodebreakersState extends Schema {
    @type({ set: "string" }) public currentStates: SetSchema<string> = new SetSchema<string>();
    @type("number") public guessesRemaining!: number;
    @type("string") public currentClue!: string;
    @type("string") public tripWord!: string;
    @type("string") public currentTeam!: string;
    @type({ set: "string" }) public hostUserIds: SetSchema<string> = new SetSchema<string>();
    @type({ map: CodebreakersPlayer }) public players: MapSchema<CodebreakersPlayer> = new MapSchema<CodebreakersPlayer>();
    @type([ CodebreakerBoardItem ]) public board: ArraySchema<CodebreakerBoardItem> = new ArraySchema<CodebreakerBoardItem>();
}
