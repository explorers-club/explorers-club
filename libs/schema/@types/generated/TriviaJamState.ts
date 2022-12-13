// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.44
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class TriviaJamState extends Schema {
    @type("string") public hostUserId!: string;
    @type([ "string" ]) public playerUserIds: ArraySchema<string> = new ArraySchema<string>();
}
