// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.44
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { ClubPlayer } from './ClubPlayer'

export class ClubState extends Schema {
    @type("string") public hostUserId!: string;
    @type("string") public selectedGame!: string;
    @type("string") public configDataSerialized!: string;
    @type("string") public gameRoomId!: string;
    @type({ map: ClubPlayer }) public players: MapSchema<ClubPlayer> = new MapSchema<ClubPlayer>();
}
