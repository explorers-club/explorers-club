// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.44
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class ChatState extends Schema {
    @type({ set: "string" }) public currentStates: SetSchema<string> = new SetSchema<string>();
    @type({ set: "string" }) public chatId: SetSchema<string> = new SetSchema<string>();
    @type([ "string" ]) public messagesSerialized: ArraySchema<string> = new ArraySchema<string>();
}
