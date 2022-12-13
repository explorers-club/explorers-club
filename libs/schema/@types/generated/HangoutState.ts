// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.44
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class HangoutState extends Schema {
    @type("string") public currentSongURL!: string;
    @type("string") public selectedGame!: string;
    @type({ map: "string" }) public playerUserIds: MapSchema<string> = new MapSchema<string>();
}
