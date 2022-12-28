// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.44
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class ClubPlayer extends Schema {
    @type("string") public userId!: string;
    @type("string") public name!: string;
    @type("boolean") public connected!: boolean;
    @type("number") public slotNumber!: number;
}
