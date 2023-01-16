// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.44
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class CodebreakerBoardItem extends Schema {
    @type("string") public word!: string;
    @type("string") public belongsTo!: string;
    @type("string") public guessedBy!: string;
}
