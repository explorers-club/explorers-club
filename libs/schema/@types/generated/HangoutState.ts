// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.44
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Player } from './Player'

export class HangoutState extends Schema {
    @type("string") public currentSongURL!: string;
    @type("string") public selectedGame!: string;
    @type({ map: Player }) public players: MapSchema<Player> = new MapSchema<Player>();
}
